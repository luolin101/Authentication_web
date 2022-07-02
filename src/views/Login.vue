<template>
  <div class="homepage-hero-module">
    <div class="video-container">
      <div :style="fixStyle" class="filter">
        <div style="width: 400px; margin: 100px auto">
          <!-- <div style="font-size: 30px; text-align: center; padding: 30px 0; color: #333">欢迎登录</div> -->
          
 <router-link :to="{path:'login'}" style="padding:20px"> <el-button type="primary" round>口令登陆</el-button> </router-link>
<router-link :to="{path:'login2'}" style="padding:20px"> <el-button type="primary" round>UKey登陆</el-button> </router-link>
<router-link :to="{path:'login3'}" style="padding:20px"> <el-button type="primary" round>扫码登陆</el-button> </router-link>


          <el-form ref="form" :model="form" size="normal" :rules="rules">
            <el-form-item prop="username">
              <el-input prefix-icon="el-icon-user-solid" v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input prefix-icon="el-icon-lock" v-model="form.pwd" show-password placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <div style="display: flex">
                <el-input prefix-icon="el-icon-key" v-model="form.validCode" style="width: 50%;" placeholder="请输入验证码"></el-input>
                <ValidCode @input="createValidCode" />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 100%" type="primary" @click="login">登 录</el-button>
            </el-form-item>
            <!-- <el-form-item><el-button type="text" @click="$router.push('/register')">前往注册 >> </el-button></el-form-item> -->
          </el-form>
        </div>
      </div>
      <video :style="fixStyle" autoplay loop muted class="fillWidth" v-on:canplay="canplay">
        <source src="../assets/sea.mp4" type="video/mp4"/>
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
  components:{
    ValidCode,
  },
  data() {
    return {
      radio1: 1,
      vedioCanPlay: false,
      fixStyle: '',
      form: {},
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        pwd: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      },
      validCode: ''
    }
  },
  watch: {
    radio1(newradio, oldradio) {
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
   beforeMount(){
     request.get("/user/count").then(res=>{
       if(res.data===0){
          this.$router.push("/admin")
       }
     })
   },
  mounted() {
    sessionStorage.removeItem("user")
    window.onresize = () => {
      const windowWidth = document.body.clientWidth
      const windowHeight = document.body.clientHeight
      const windowAspectRatio = windowHeight / windowWidth
      let videoWidth
      let videoHeight
      if (windowAspectRatio < 0.5625) {
        videoWidth = windowWidth
        videoHeight = videoWidth * 0.5625
        this.fixStyle = {
          height: windowWidth * 0.5625 + 'px',
          width: windowWidth + 'px',
          'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
          'margin-left': 'initial'
        }
      } else {
        videoHeight = windowHeight
        videoWidth = videoHeight / 0.5625
        this.fixStyle = {
          height: windowHeight + 'px',
          width: windowHeight / 0.5625 + 'px',
          'margin-left': (windowWidth - videoWidth) / 2 + 'px',
          'margin-bottom': 'initial'
        }
      }
    }
    window.onresize()
  },
  methods: {
    canplay() {
      this.vedioCanPlay = true
    },
    // 接收验证码组件提交的 4位验证码
    createValidCode(data) {
      this.validCode = data
    },
    login () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.form.validCode) {
            this.$message.error("请填写验证码")
            return
          }
          if(this.form.validCode.toLowerCase() !== this.validCode.toLowerCase()) {
            this.$message.error("验证码错误")
            return
          }
          request.post("/user/login", this.form).then(res => {
            if (res.code === '0') {
              this.$message.success("登陆成功");
              sessionStorage.setItem("user", JSON.stringify(res.data))  // 缓存用户信息
              this.$router.push("/")  //登录成功之后进行页面的跳转，跳转到主页

            } else {
              this.$message.error(res.msg);
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.homepage-hero-module,
.video-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.video-container .poster img{
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
