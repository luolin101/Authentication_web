<template>
  <div class="homepage-hero-module">
    <div class="video-container">
      <div :style="fixStyle" class="filter">
        <div style="width: 400px; margin: 100px auto">
         <router-link :to="{path:'login'}" style="padding:20px"> <el-button type="primary" round>口令登陆</el-button> </router-link>
<router-link :to="{path:'login2'}" style="padding:20px"> <el-button type="primary" round>UKey登陆</el-button> </router-link>
<router-link :to="{path:'login3'}" style="padding:20px"> <el-button type="primary" round>扫码登陆</el-button> </router-link>
          <el-form ref="form" :model="form" size="normal" :rules="rules">
            <el-form-item prop="PIN">
              <el-input
                prefix-icon="el-icon-lock"
                v-model="form.PIN"
                show-password
                placeholder="请输入PIN"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button style="width: 100%" type="primary" @click="isPIn"
                >登 录</el-button
              >
            </el-form-item>
            <!-- <el-form-item><el-button type="text" @click="$router.push('/register')">前往注册 >> </el-button></el-form-item> -->
          </el-form>
        </div>
      </div>
      <video
        :style="fixStyle"
        autoplay
        loop
        muted
        class="fillWidth"
        v-on:canplay="canplay"
      >
        <source src="../assets/sea.mp4" type="video/mp4" />
        浏览器不支持 video 标签，建议升级浏览器。
      </video>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import ValidCode from "@/components/ValidCode";
export default {
  name: "Login",
  components: {
    ValidCode,
  },
  data() {
    return {
      radio2: 2,
      vedioCanPlay: false,
      fixStyle: "",
      form: {},
      rules: {
        PIN: [{ required: true, message: "请输入PIN", trigger: "blur" }],
      },
      hashdata:"",
      validCode: "",
      ukey: {},
    };
  },
  watch: {
    radio2(newradio, oldradio) {
      if(newradio!==oldradio){
        if(newradio===1)
         this.$router.replace("/login")
         if(newradio===2)
         this.$router.replace("/login2")
         if(newradio===3)
         this.$router.replace("/login3")
      }
    }
  },
  mounted() {
    sessionStorage.removeItem("user");
    window.onresize = () => {
      const windowWidth = document.body.clientWidth;
      const windowHeight = document.body.clientHeight;
      const windowAspectRatio = windowHeight / windowWidth;
      let videoWidth;
      let videoHeight;
      if (windowAspectRatio < 0.5625) {
        videoWidth = windowWidth;
        videoHeight = videoWidth * 0.5625;
        this.fixStyle = {
          height: windowWidth * 0.5625 + "px",
          width: windowWidth + "px",
          "margin-bottom": (windowHeight - videoHeight) / 2 + "px",
          "margin-left": "initial",
        };
      } else {
        videoHeight = windowHeight;
        videoWidth = videoHeight / 0.5625;
        this.fixStyle = {
          height: windowHeight + "px",
          width: windowHeight / 0.5625 + "px",
          "margin-left": (windowWidth - videoWidth) / 2 + "px",
          "margin-bottom": "initial",
        };
      }
    };
    window.onresize();

  request.get("/user/random").then(res=>{
       this.hashdata=res.data
     })

  },
  methods: {
    isPIn() {
      var skf = new SKF("swskfapi");
      var rv_enumDev = skf.SKF_EnumDev();
      var hDev = 0;
      if (rv_enumDev.value.length !== 0) {
        for (var i = 0; i < rv_enumDev.value.length; i++) {
          console.log(rv_enumDev.value[i]);
          hDev = skf.SKF_ConnectDev(rv_enumDev.value[i]).value;
          console.log(hDev);
        }
      }
      else{
        console.log("啥玩意儿")
        this.$message.error("无设备")
        return
      }
      var flag = 1;
      console.log(this.form.PIN)
      flag = skf.SKF_VerifyPIN(hDev, this.form.PIN, 1).status;
      if (flag === 0) {
        var sm2 = skf.SKF_EnumContainer(hDev).value[0];
        console.log(sm2);
        var serial=skf.SKF_GetDevInfo(hDev).value.SerialNumber
        console.log("serial",serial)
        this.ukey.serial=serial

        this.hashdata=this.hashdata+serial
        var pk=skf.SKF_ExportPublicKey (hDev, sm2, 1, 0).value
        var hHash=skf.SKF_DigestInit (hDev, 1, pk, "1234567812345678",0).value
        this.hashdata=skf.SKF_Digest (hHash, this.hashdata,0).value
        console.log(this.hashdata);
        
        this.ukey.out=skf.SKF_ECCSignData(hDev,sm2,this.hashdata).value
        request.post("/user/login2", this.ukey).then((res) => {
            if (res.code === "0") {
              this.$message.success("登陆成功");
              sessionStorage.setItem("user", JSON.stringify(res.data)); // 缓存用户信息
              this.$router.push("/"); //登录成功之后进行页面的跳转，跳转到主页
            } else {
              this.$message.error(res.msg);
            }
          });
        
      }
      else{
        this.$message.error("PIN错误")
      }
    },
    canplay() {
      this.vedioCanPlay = true;
    },
    login() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          request.post("/user/login2", this.form).then((res) => {
            if (res.code === "0") {
              this.$message.success("登陆成功");
              sessionStorage.setItem("user", JSON.stringify(res.data)); // 缓存用户信息
              this.$router.push("/"); //登录成功之后进行页面的跳转，跳转到主页
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.homepage-hero-module,
.video-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.video-container .poster img {
  z-index: 0;
  position: absolute;
}

.video-container .filter {
  z-index: 1;
  position: absolute;
  /*background: rgba(0, 0, 0, 0.4);*/
  width: 100%;
}

.fillWidth {
  width: 100%;
}
</style>
