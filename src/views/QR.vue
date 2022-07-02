<template>
  <div class="homepage-hero-module">
    <div class="video-container">
      <div :style="fixStyle" class="filter">
  <!-- 扫码登录 -->
  <router-link :to="{path:'login'}" style="padding:20px;top:20px;"> <el-button type="primary" round>口令登陆</el-button> </router-link>
<router-link :to="{path:'login2'}" style="padding:20px;top:20px;"> <el-button type="primary" round>UKey登陆</el-button> </router-link>
<router-link :to="{path:'login3'}" style="padding:20px;top:20px;"> <el-button type="primary" round>扫码登陆</el-button> </router-link>

   
  <div class="login_box">
    <router-link to="/input">
      <div class="login_close"></div>
    </router-link>
    <div class="qrcode">
      <img class="img" :src="imgURL" alt="登录码" v-show="state === 1||state === 3"/>
      <div class="empty" v-show="state === 0"></div>
      <div class="refresh" v-show="state === 3">
        <i class="refresh_mask"></i>
        <i class="refresh_icon" @click="getToken"></i>
      </div>
      <div class="result" v-show="state === 2">
        <img class="u_avatar" :src="userAvatar" alt="用户头像"/>
        <p class="u_name">{{userName}}</p>
      </div>
      <div>
        <p class="sub_title">{{tip}}</p>
        <p class="sub_desc">扫码登录，更易、更快、更安全</p>
      </div>
    </div>
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
  name: 'Auth',
  data () {
    return {
      radio: 3,
      state: 0, // 场景：0无登录码，1有登陆码，2正在登录，3登录码过期
      count: 30, // 登录码有效倒计时（S）
      tip: '正在获取登录码，请稍等', // 提示
      imgURL: '', // 登录码路径
      authToken: '', // 验证口令
      userId: '', // 扫码登录的用户ID
      userAvatar: '', // 扫码登录的用户头像
      userName: '', // 扫码登录的用户名
      tokenApi: '/auth/token', // 获取口令
      tokenImgApi: '/auth/img/', // 获取口令对应的登录码
      tokenInfoApi: '/auth/info/', // 获取口令信息
      userInfoApi: '/user/base/' // 获取用户信息
    }
  },
  watch: {
    radio3(newradio, oldradio) {
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
  created () {
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
    this.getToken()
  },
  methods: {
    getToken () {
      console.log('开始获取')
      // 所有参数重置
      this.state = 0 // 场景为无二维码
      this.tip = '正在获取登录码，请稍等'
      this.count = 30
      clearInterval(this.timeCount)
      // 开始获取新的token
      request.post(this.tokenApi).then((res) => {
        // 保存token，改变场景，显示登录码，开始轮询
        this.authToken = res.data
        console.log(this.authToken,"token")
        this.state = 1 // 场景为有登录码
        this.tip = '请使用手机口令扫码登录'
        this.imgURL = 'http://localhost:9090'+this.tokenImgApi + res.data // 拼装获得登录码链接
        console.log(this.imgURL)
        this.timeCount = setInterval(this.getTokenInfo, 1000) // 开启每隔1S的轮询，向服务器请求口令信息
      }).catch((error) => {
        console.log(error)
        this.getToken()
      })
    },
    getTokenInfo () {
      // 登录码有效时间减少
      this.count--
      // 登录码到期，改变场景
      if (this.count === 0) {
        this.state = 3 // 场景为登录码过期
        this.tip = '二维码已过期，请刷新'
      }
      // 防止计数溢出
      if (this.count < -1000) {
        this.count = -1
      }
      // 轮询查询token状态
      request.post(this.tokenInfoApi + this.authToken).then((response) => {
        let auth = response.data
        // token状态为登录成功
        if (auth.authState === 1) {
          this.$message({
            message: '登录成功！',
            type: 'success'
          })
          clearInterval(this.timeCount) // 关闭轮询，溜了
          this.$router.push("/")
          // token状态为正在登陆，改变场景，请求扫码用户信息
        } else if (auth.authState === 2) {
          this.userId = auth.userId
          this.getUserInfo()
          this.state = 2
          this.tip = '扫码成功，请在手机上确认'
          // token状态为过期（服务器），改变场景
        } else if (auth.authState === 3) {
          this.state = 3
          this.tip = '二维码已过期，请刷新'
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getUserInfo () {
      request.get(this.userInfoApi+this.userId).then((res) => {
        // 获取用户信息，并进行显示
        this.userName = res.data.username
        this.userAvatar = res.data.userAvatar
        sessionStorage.setItem("user", JSON.stringify(res.data))  // 缓存用户信息
        console.log(res)
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
  /*登录框*/
  .login_box {
    z-index: 99;
    position: absolute;
    width: 380px;
    height: 540px;
    top: 50%;
    left: 50%;
    margin-left: -190px;
    margin-top: -270px;
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 2px 10px #999;
  }

  .login_close {
    position: absolute;
    top: 0;
    right: 0;
    width: 64px;
    height: 64px;
    background: url(../assets/img/pcinput.png) no-repeat right top;
    background-size: 100% 100%;
    border-top-right-radius: 5px;
    cursor: pointer;
    z-index: 99;
  }
  /*二维码*/
  .qrcode {
    position: relative;
    text-align: center;
  }

  /* 二维码获取 */
  .qrcode .img {
    display: block;
    width: 240px;
    height: 240px;
    margin: 70px auto 25px;
  }

  .qrcode .sub_title {
    text-align: center;
    font-size: 19px;
    color: #353535;
    margin-bottom: 23px;
  }

  .qrcode .sub_desc {
    text-align: center;
    color: #a3a3a3;
    font-size: 14px;
    padding: 0 40px;
    line-height: 1.8;
  }

  /* 二维码为空 */
  .qrcode .empty {
    display: block;
    width: 240px;
    height: 240px;
    margin: 70px auto 25px;
    background: #d7e8fc;
  }

  /* 二维码刷新 */
  .qrcode .refresh {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 240px;
  }

  .qrcode .refresh .refresh_mask {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -120px;
    margin-top: -120px;
    width: 240px;
    height: 240px;
    background: #ffffffe0;
  }

  .qrcode .refresh .refresh_icon {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -48px;
    margin-top: -48px;
    height: 96px;
    width: 96px;
    cursor: pointer;
    background: url(../assets/img/refresh.png) no-repeat;
  }

  .qrcode .refresh .refresh_icon:hover {
    animation: refresh 1s linear infinite;
  }

  @keyframes refresh {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  /* 二维码结果 */
  .qrcode .result {
    display: block;
    width: 240px;
    height: 240px;
    margin: 70px auto 25px;
  }

  .qrcode .result .u_avatar {
    height: 150px;
    width: 150px;
    margin-top: 15px;
    border-radius: 5px;
    box-shadow: 0 2px 10px #999;
    -moz-box-shadow: #999 0 2px 10px;
    -webkit-box-shadow: #999 0 2px 10px;
  }

  .qrcode .result .u_name {
    text-align: center;
    font-size: 19px;
    color: #353535;
    margin-top: 20px;
  }


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
