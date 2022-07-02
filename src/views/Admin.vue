<template>
  <div class="homepage-hero-module">
    <div class="video-container">
      <div :style="fixStyle" class="filter">
        <div style="width: 400px; margin: 100px auto">
          <div style="font-size: 30px; text-align: center; padding: 30px 0; color: #333">管理员创建</div>
          <el-form ref="form" :model="form" size="normal" :rules="rules">
            <el-form-item prop="username">
              <el-input prefix-icon="el-icon-user-solid" v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input prefix-icon="el-icon-lock" v-model="form.pwd" show-password placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 100%" type="primary" @click="login">创 建</el-button>
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

export default {
  name: "Login",
  data() {
    return {
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
    }
  },
    beforeMount(){
      request.get("/user/count").then(res=>{
        if(!(res.data===0)){
           this.$router.push("/login")
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
    login () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          request.post("/user/addAdmin", this.form).then(res => {
            if (res.code === '0') {
              this.$message.success("添加成功");
              this.$router.push("/login")  //登录成功之后进行页面的跳转，跳转到主页
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
