<template>
  <div class="video-main"
       v-show="show"
       :class="!pip ? 'transition-fade-in' : 'transition-fade-out'">
    <div class="video-header text-elip inline-block-v-middle">
      <div class="head-title text-elip inline-block-v-middle"
           :title="activeFileObj.fileName">
        {{ activeFileObj.fileName }}
      </div>
      <div class="header-right inline-block-v-middle">
        <i class="iconfont icon-tishi hot-key" title="快捷键说明"></i>
        <!--快捷键提示-->
        <div class="player-hotkey-panel-container">
          <div class="player-hotkey-panel-title">快捷键说明
          </div>
          <div class="player-hotkey-panel-wrap"
               style="touch-action: pan-x; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">

            <div class="player-hotkey-panel">
              <div class="player-hotkey-panel-item" v-for="(item,index) in videoHotkey" :key="index">
                <span class="player-hotkey-panel-key">{{ item.key }}</span>
                <span class="player-hotkey-panel-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <a :href="getDownloadFilePath(this.videoList[playIndex])">
          <i class="iconfont icon-xiazai"></i>
        </a>
        <i class="iconfont"
           :class="isFoldVideoList ? 'icon-shouqiliebiao':'icon-zhankailiebiao'"
           :title="isFoldVideoList ? '展开播放列表' : '收起播放列表'"
           @click="isFoldVideoList = !isFoldVideoList"
        ></i>
        <i class="iconfont icon-guanbi" @click="handleClosePreview"></i>


      </div>

    </div>

    <div class="player-box-main">

      <div class="plyr-main" :onBlur="blur">
        <vue-plyr :options="options" ref="plyr">
          <video id="player" playsinline
                 :autoplay="true"
                 :global="true"
                 :controls="controls">
            <source :src="getMediaStreamPath(this.videoList[this.defaultIndex])"
                    type="video/mp4" />
          </video>
        </vue-plyr>
      </div>
      <div class="play-list-main" v-show="!isFoldVideoList">
        <ul class="video-list">
          <li class="video-list-item text-elip" v-for="(item,index) in videoList"
              @click="play(index)"
              :global="true"
              :class="[playIndex === index ? 'active' : '']"
              :key="index">
              <span class="playing-box">
                <div class="playing inline-block-v-middle"
                     :class="playIndex === index ? 'active' : ''"
                     v-show="playIndex === index">
                <span class="playing__bar playing__bar1"
                      :class="playing? '': 'pause'"></span>
                <span class="playing__bar playing__bar2" :class="playing? '': 'pause'"></span>
                <span class="playing__bar playing__bar3" :class="playing? '': 'pause'"></span>
              </div>
              </span>
            <span class="text-elip" :title="item.fileName">{{ item.fileName }}</span>
          </li>
        </ul>
      </div>


    </div>

  </div>

</template>

<script>
import store from '@/store'
import { videoHotkey } from '@/libs/map.js'

export default {
  name: 'VideoPlayer',
  props: {},
  components: {},
  data () {
    return {
      focusedElement: document.querySelector('#player'),
      videoHotkey,
      player: Object,
      // 视频播放是否可视
      visible: false,
      pip: false,
      show: true,
      // 显示播放列表
      isFoldVideoList: false,
      playing: false,
      // 播放列表索引
      playIndex: 0,
      preFix: 'http://txcdn.leaving.top/pan/media/',
      source: {
        type: 'video',
        title: 'Example title',
        sources: [
          {
            src: 'http://txcdn.leaving.top/pan/media/play.mp4',
            type: 'video/mp4',
            size: 720
          },
          {
            src: 'http://txcdn.leaving.top/pan/media/play-1080.mp4',
            type: 'video/webm',
            size: 1080
          }
        ],
        poster: '@/assets/logo.png',
        previewThumbnails: {
          src: '/path/to/thumbnails.vtt'
        },
        tracks: [
          {
            kind: 'captions',
            label: 'English',
            srclang: 'en',
            src: '/path/to/captions.en.vtt',
            default: true
          },
          {
            kind: 'captions',
            label: 'French',
            srclang: 'fr',
            src: '/path/to/captions.fr.vtt'
          }
        ]
      },
      quality: {
        default: 576,
        options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
      },
      controls: [
        'play-large', // 中间的大播放按钮
        'restart', // 重新开始播放
        'rewind', // 按寻道时间倒带（默认 10 秒）
        'play', // 播放/暂停播放
        'fast-forward', // 快进查找时间（默认 10 秒）
        'progress', // 播放和缓冲的进度条和滑动条
        'current-time', // 播放的当前时间
        ' duration', // 媒体的完整持续时间
        'mute', // 切换静音
        'volume', // 音量控制
        'captions', // 切换字幕
        'settings', // 设置菜单
        'pip', // 画中画（当前仅 Safari）
        'airplay', // Airplay（当前仅 Safari）
        'download ', // 显示一个下载按钮，其中包含指向当前源或您在选项中指定的自定义 URL 的链接
        'fullscreen' // 切换全屏
      ],
      settings: ['captions', 'quality', 'speed', 'loop'],
      // i18n国际化配置
      options: {

        i18n: {
          speed: '速度',
          normal: '正常',
          restart: '重新开始',
          rewind: 'Rewind {seektime}s',
          play: '播放',
          pause: '暂停',
          fastForward: 'Forward {seektime}s',
          seek: 'Seek',
          seekLabel: '{currentTime} of {duration}',
          played: '播放中',
          buffered: '缓冲中',
          currentTime: '当前时间',
          duration: '时长',
          volume: '音量',
          mute: '静音',
          unmute: '取消静音',
          enableCaptions: '启用字幕',
          disableCaptions: '禁用字幕',
          download: '下载',
          enterFullscreen: '全屏',
          exitFullscreen: '退出全屏',
          frameTitle: 'Player for {title}',
          captions: '字幕',
          settings: '设置',
          pip: '画中画',
          menuBack: 'Go back to previous menu',
          quality: '质量',
          loop: '循环',
          start: '开始',
          end: '结束',
          all: '所有',
          reset: '重置',
          disabled: '不可用',
          enabled: '可用',
          advertisement: '广告',
          qualityBadge: {
            2160: '4K',
            1440: 'HD',
            1080: 'HD',
            720: 'HD',
            576: 'SD',
            480: 'SD'
          }
        },
        resetOnEnd: true,
        invertTime: false,
        global: true,
        volume: 0.5,
        tooltips: {
          controls: true,
          seek: true
        },
        settings: ['captions', 'quality', 'speed', 'loop'],
        quality: {
          default: 720,
          options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
        },
        // 开启plyr全局快捷键
        keyboard: {
          focused: true,
          global: true
        }
      }
    }
  },
  watch: {
    'this.player.pip': function(value) {
      console.log('pip' + value)
    },
    $router: function() {
      this.handleClosePreview()
    },
    // 监听视频预览组件状态
    visible (newValue) {
      if (newValue) {
        this.playIndex = this.defaultIndex
      }
    },
    screenWidth (newValue) {
      if (newValue <= 768) {
        this.isFoldVideoList = true
      }
    }
  },
  computed: {
    // 当前显示的文件信息
    activeFileObj () {
      return this.videoList.length ? this.videoList[this.playIndex] : {}
    },
    getPlayer () {
      return this.$refs.plyr.player
    },
    // 屏幕宽度
    screenWidth () {
      return store.state.common.screenWidth
    },
    playVideoLink () {
      return this.preFix + this.videoList[this.playIndex].fileName
    }
  },
  created () {

  },
  mounted: function() {
    console.log('this.focusedElement', this.focusedElement)
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function() {
      history.pushState(null, null, document.URL)
    })
    this.player = this.getPlayer
    this.player.on('pause', () => this.pauseAction())
    this.player.on('play', () => this.playAction())
    this.player.on('pip', () => this.pipAction())
    // 进入和离开画中画隐藏和显示播放页面
    this.player.on('enterpictureinpicture', (event) => {
      var pipWindow = event.pictureInPictureElement // 获取当前 pip 窗口 ?
      // var main = document.querySelector('.video-main')
      // main.classList.remove('transition-fade-in')
      // main.classList.add('transition-fade-out')
      this.pip = true
      if (pipWindow !== null) {
        this.visible = false
        setTimeout(() => {
          this.show = false
        }, 1)
      } else {
        return false
      }
    })
    // 关闭画中画
    this.player.on('leavepictureinpicture', (event) => {
      var main = document.querySelector('.video-main')
      main.classList.remove('transition-fade-out')
      main.classList.add('transition-fade-in')
      this.visible = true
      this.show = true
      this.pip = false
    })
    console.log(this.player)
  },
  methods: {
    blur () {
      this.focusedElement.focus()
    },
    playAction () {
      this.playing = true
      var el = document.querySelector('.playing__bar')
      el.style.animationPlayState = 'running'
    },
    pauseAction () {
      this.playing = false
      var el = document.querySelector('.playing__bar')
      el.style.animationPlayState = 'paused'
    },
    play (index) {
      if (this.playIndex === index) {
        console.log('当前播放index:' + index)
        if (this.player.playing) {
          this.player.pause()
        } else {
          this.player.play()
        }
      } else {
        this.playIndex = index
        this.player.media.src = this.getMediaStreamPath(this.videoList[index])
        this.player.play()
      }
    },
    // 关闭视频预览
    handleClosePreview () {
      this.player.pause()
      this.player.media = null
      this.options.keyboard.global = false
      this.show = true
      this.pip = true
      setTimeout(() => {
        this.callback('cancel')
      }, 799)
    }
  }
}
</script>

<style lang="less">
@-webkit-keyframes up-and-down {
  10% {
    height: 30%;
  }

  30% {
    height: 100%;
  }

  60% {
    height: 50%;
  }

  80% {
    height: 75%;
  }

  100% {
    height: 20%;
  }

}

@keyframes up-and-down {
  10% {
    height: 30%;
  }

  30% {
    height: 100%;
  }

  60% {
    height: 50%;
  }

  80% {
    height: 75%;
  }

  100% {
    height: 20%;
  }

}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  /*初始状态 透明度为0*/
  40% {
    opacity: 0;
  }
  /*过渡状态 透明度为0*/
  100% {
    opacity: 1;
  }
  /*结束状态 透明度为1*/
}

@-webkit-keyframes fade-in { /*针对webkit内核*/
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes bottom-to-top {
  0% {
    transform: translateY(100%);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes top-to-bottom {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(100%);
  }
}

@keyframes slide {
  0% {
    top: 0;
  }
  30% {
    top: 30%;
  }
  60% {
    top: 60%;
  }
  100% {
    top: 100%;
  }
}

.video-main {
  width: 100%;
  height: 100%;
  background-color: #000000;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  flex-flow: row;
  z-index: 1999;
  transition: bottom 0.5s ease;

  .video-header {
    width: 100%;
    height: 60px;
    border-bottom: 3px solid #878c9c;
    z-index: 1999;
    vertical-align: middle;
    min-width: 280px;

    .head-title {
      left: 10px;
      width: calc(100% - 240px);
      max-width: calc(100% - 2.92826vw);
      margin-left: 20px;
      font-size: 17px;
      line-height: 60px;
      font-weight: 700;
      width: 100% -200px;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .header-right {
      margin-right: 0px;
      width: 200px;
      right: 10px;
      height: 60px;
      text-align: right;
      vertical-align: baseline;

      .player-hotkey-panel-container {
        background: rgba(33, 33, 33, .9);
        border-radius: 4px;
        color: #fff;
        -webkit-font-smoothing: antialiased;
        position: absolute;
        margin-top: 150px;
        margin-right: 70px;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        text-align: center;
        width: 400px;
        display: none;
        z-index: 899;

        .player-hotkey-panel-title {
          font-size: 16px;
          text-align: center;
          line-height: 40px;
          border-bottom: 1px solid hsla(0, 0%, 100%, .12);
        }

        .player-hotkey-panel-wrap {
          margin: 15px 0;
          max-height: 268px;

          .player-hotkey-panel {
            overflow: auto;
            padding: 0 50px 0 40px;

            .player-hotkey-panel-item {
              height: 24px;
              line-height: 24px;
              min-width: 290px;
              font-size: 12px;
              text-align: center;
              font-size: 16px;

              .player-hotkey-panel-key {
                width: 150px;
                display: inline-block;
              }

              .player-hotkey-panel-value {
                width: 150px;
                display: inline-block;
                color: #999;
              }
            }
          }
        }
      }

      .hot-key {
        font-size: 18px;
      }


      .iconfont:hover {
        color: #06a7ff;
      }

      .icon-tishi:hover + .player-hotkey-panel-container {
        display: block !important;
      }

      .iconfont {
        color: #fff;
        cursor: pointer;
        padding: 0 15px;
      }

      .icon-xiazai {
        font-size: 20px;
        font-weight: 700;
      }

      .icon-guanbi {
        font-size: 20px;
        line-height: 60px;

      }
    }


  }

  .player-box-main {
    display: flex;
    height: calc(100vh - 60px);
    display: -webkit-box;
    display: -ms-flexbox;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;

    .plyr-main {
      top: 0;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      width: 100%;
      height: 100%;
      -o-object-fit: fill;
      object-fit: fill;
    }

    .play-list-main {
      margin-left: 8px;
      background: #000;
      width: 280px;
      height: 100%;
      color: #fff;
      border-left: 3px solid #636d7e;

      .video-list {
        width: 100%;
        height: 50px;
        padding-left: 15px;
        line-height: 50px;
        font-weight: 600;
        text-align: left;

        .video-list-item:hover {
          color: #06a7ff;
        }

        .video-list-item {
          cursor: pointer;

          .playing-box {
            line-height: 60px;
            display: inline-block;
            height: 40px;
            width: 40px;
            position: relative;

            .icon-yinpinbofang1 {
              position: absolute;
              color: #fff;
              left: 2px;
              font-size: 14px;
              line-height: 40px;
            }

            .playing {
              position: absolute;
              top: 11px;
              background: rgba(255, 255, 255, 0.1);
              width: 1rem;
              height: 1rem;
              border-radius: 0.3rem;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              padding: 0.1rem;
              box-sizing: border-box;
              line-height: 60px;


              .playing__bar.pause {
                animation: none !important;
              }

              .playing__bar {
                display: inline-block;
                background: white;
                width: 0.1rem;
                height: 100%;
                -webkit-animation: up-and-down 1.3s ease infinite alternate;
              }

              .playing__bar1 {
                height: 60%;
              }

              .playing__bar2 {
                height: 30%;
                -webkit-animation-delay: -2.4s;
                animation-delay: -2.4s;
              }

              .playing__bar3 {
                height: 75%;
                -webkit-animation-delay: -3.7s;
                animation-delay: -3.7s;
              }
            }

          }


        }

        .video-list-item.active {
          color: #06a7ff;
        }
      }
    }
  }
}
</style>
