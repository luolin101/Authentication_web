<template>
  <div class="audio-main float"
       v-show="visible"
       v-bind:id="id"
       :class="[floatSize ==='default' ? 'default-size': 'min-size']"
  >
    <!--标题-->
    <!--@mousedown="mousedown"-->

    <!--@mousedown="down" @touchstart.stop="down"-->
    <!--@mousemove="move" @touchmove.stop="move"-->
    <div class="audio-song-title"
         @dblclick="changeFloatSize"
         @mousedown="mousedown"
         @touchmove.stop="mousedown"
    >
      <span class="title-text">{{ songTitle }}</span>
      <span class="title-right">
        <i class="iconfont operate min cursor-p icon-2zuixiaohua-2" title="最小化"
           v-show="floatSize==='default'"
           @click="changeFloatSize()"></i>
        <i class="iconfont operate min cursor-p icon-zuidahua" title="最大化"
           v-show="floatSize==='min'"
           @click="changeFloatSize()"></i>
        <i class="iconfont operate bold cursor-p icon-guanbi" @click="closeFloatWindow()" title="关闭浮窗"></i>
      </span>

    </div>
    <!--播放器-->
    <div class="play-box">
      <vue-plyr :options="options"
                :type="mode"
                :invertTime="false"
                :autoplay="true"
                v-show="floatSize !== 'min'" ref="plyr"
                :class="{'default':mode==='default'}">
        <audio id="player" :controls="controls"
               ref="=audioPlayer"
        >
          <source :src="audioSrc" type="audio/mp3" :data-src="audioSrc"
                  ref="audioPlayer" />
        </audio>

      </vue-plyr>
      <i class="iconfont icon-xuanfuchuang" v-show="mode==='default'" @click="changeMode()"></i>
    </div>

    <!--播放列表-->
    <div class="audio-song-list" v-show="mode==='float' && floatSize === 'default'">
      <ul class="list">
        <li class="item" v-for="(item, index) in audioList" :key="index"
            @click="play(index)"
            :class="songTitle===item.fileName?'active': ''">
          <span :title="item.fileName" class="name cursor-p">{{ item.fileName }}</span>
          <span class="operate">
            <i title="从列表删除" class="iconfont icon-tishicuowu cursor-p" v-show="songTitle!==item.fileName"
               @click="deleteSong(index)"></i>
          </span>
        </li>
      </ul>
    </div>


  </div>

</template>

<script>
// 鼠标位置和div的左上角位置 差值
// var dx, dy
// var screenWidth = window.screen.width
// var screenHeight = window.screen.height
export default {
  name: 'AudioPlayer',
  props: {
    show: {
      type: Boolean
    },
    file: {
      type: Object
    },
    playList: {
      type: Array
    }
  },
  components: {},
  data () {
    return {
      // 播放器实例
      player: Object,
      // 音频预览组件是否可见
      visible: false,
      // 歌曲播放标题
      songTitle: '',
      // plyr播放器显示控制器
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
      id: 'audio-main',
      // 播放器样式 default:默认贴底, float:浮窗  !!! 已弃用此设置,采用浮窗,可调节大小!!!
      mode: 'float',
      floatWidth: (window.innerWidth - 500) + 'px',
      // 浮窗大小 default:默认 ,min:最小化
      // 浮窗大小
      floatSize: 'default',
      // 当前播放歌曲索引
      playIndex: 0,
      audioSrc: '',
      // 播放列表
      songList: [
        {
          fileName: 'Anthony Keyrouz _ Romy Wave - Something Just Like This.mp3',
          src: '@/assets/audio/Anthony Keyrouz _ Romy Wave - Something Just Like This.mp3'
        },
        {
          fileName: 'G.E.M. 邓紫棋 - 光年之外.mp3',
          src: '@/assets/audio/G.E.M. 邓紫棋 - 光年之外.mp3'
        },
        {
          fileName: 'G.E.M. 邓紫棋 - 透明.mp3',
          src: '@/assets/audio/G.E.M. 邓紫棋 - 透明.mp3'
        }
      ],
      // plyr配置
      options: {
        // 国际化配置
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
          enableCaptions: '启用标题',
          disableCaptions: '禁用标题',
          download: '下载',
          enterFullscreen: '全屏',
          exitFullscreen: '退出全屏',
          frameTitle: 'Player for {title}',
          captions: '字幕',
          settings: '设置',
          pip: 'PIP',
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
        // 播放完成重置
        resetOnEnd: true,
        // 初始音量
        volume: 0.5,
        // 使用反转时间计时
        invertTime: false,
        global: true,
        tooltips: {
          controls: true,
          seek: true
        },
        // 开启plyr全局快捷键
        keyboard: {
          focused: true,
          global: true
        }
      },
      position: {
        x: 320,
        y: 60
      },
      flags: false
    }
  },
  watch: {},
  computed: {
    // 获得当前plyr对象
    getPlayer () {
      return this.$refs.plyr.player
    }
  },
  created () {
    this.mode = 'float'
  },
  mounted () {
    this.player = this.getPlayer
    this.songList = this.audioList
    this.playIndex = this.defaultIndex
    // this.player.media.src = this.preFix + this.audioList[this.playIndex].fileName
    this.audioSrc = this.getMediaStreamPath(this.audioList[this.defaultIndex])
    // this.preFix + this.audioList[this.defaultIndex].fileName
    this.songTitle = this.audioList[this.playIndex].fileName
    this.player.on('pause', () => this.pauseAction())
    this.player.on('ended', () => this.endedAction(this.playIndex))
  },
  methods: {
    // 暂停事件
    pauseAction () {
    },
    // 播放结束事件
    endedAction (index) {
      // 列表还有歌曲继续播放
      if (index < this.songList.length) {
        this.play(this.playIndex + 1)
      }
    },
    // 播放
    play (index) {
      // 当点击列表时点击和当前播放歌曲相同则暂停,暂停时则播放
      if (index === this.playIndex) {
        if (this.player.playing) {
          this.player.pause()
        } else {
          this.player.play()
        }
      } else {
        this.playIndex = index
        this.songTitle = this.audioList[index].fileName
        // this.$refs.plyr.player.media.src = this.preFix + this.audioList[index].fileName
        this.player.media.src = this.getMediaStreamPath(this.audioList[index])
        // this.preFix + this.audioList[index].fileName
        this.player.play()
      }
    },
    // 关闭播放窗口
    closeFloatWindow () {
      const audio = document.getElementById('player')
      audio.pause()
      this.player.media = null
      this.options.keyboard.global = false
      this.visible = false
      this.callback('cancel')
    },
    // 修改窗口模式    !已弃用!
    changeMode (mode) {
      if (this.mode === 'default') {
        this.mode = 'float'
      } else {
        this.mode = 'default'
      }
    },
    // 修改窗口大小
    changeFloatSize () {
      if (this.floatSize === 'default') {
        this.floatSize = 'min'
      } else {
        this.floatSize = 'default'
      }
    },
    // 删除播放列表歌曲
    deleteSong (index) {
      this.audioList.splice(index, 1)
    },
    // 拖动浮窗事件
    mousedown (event) {
      this.selectElement = document.getElementById(this.id)
      const div1 = this.selectElement
      this.selectElement.style.cursor = 'move'
      this.isDowm = true
      const distanceX = event.clientX - this.selectElement.offsetLeft
      const distanceY = event.clientY - this.selectElement.offsetTop
      document.onmousemove = function(ev) {
        const oevent = ev || event
        div1.style.left = oevent.clientX - distanceX + 'px'
        div1.style.top = oevent.clientY - distanceY + 'px'
      }
      document.onmouseup = function() {
        document.onmousemove = null
        document.onmouseup = null
        div1.style.cursor = 'default'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.icon-xuanfuchuang {
  display: inline-block;
}

.audio-main.default {
  position: absolute !important;
}

.audio-main.float {
  margin: 0 5px;
  position: absolute;
  z-index: 3999;
  width: 400px;
  left: calc(50% - 200px);
  top: 30%;
  height: 300px;
  box-shadow: 0 0 10px #ccc;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border: 1px solid #dedede;
}

.audio-main.min-size {
  position: fixed !important;
  height: 92px !important;
}

.audio-main {
  z-index: 3000;
  position: absolute;
  width: 400px;
  max-width: 100%;
  min-width: 400px;
  background-color: #fafdff;

  .iconfont {
    cursor: pointer !important;
  }

  .iconfont:hover {
    color: #06a7ff;

  }

  .bold {
    font-weight: 700;
  }

  .audio-song-title {
    padding: 10px;
    background: #f2f7fd;
    position: relative;
    height: 40px;
    text-align: center;
    user-select: none;

    .title-text {
      max-width: 80%;
      min-width: 40%;
      display: inline-block;
      //min-width: 230px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    .title-right {
      display: inline-block;
      position: absolute;
      right: 10px;
      text-align: right;
    }

    .operate.min {
      right: 45px;
      margin-right: 10px;
    }

    i:hover {
      color: #06a7ff;
    }


  }

  .audio-song-list {
    background: #fff;
    overflow: hidden;
    position: relative;
    font-size: 12px;
    min-height: 60px;

    .list {
      overflow-x: hidden;
      overflow-y: auto;
      position: relative;
      height: 200px;
      width: 100%;
      min-height: 40px;

      .item:hover {
        background-color: #E7ECF2;;
      }

      .item {
        border-bottom: 1px solid #f2f6fd;
        position: relative;
        padding: 10px 15px;
        height: 40px;

        .name {
          max-width: 80%;
          min-width: 50%;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
          position: absolute;
          left: 10px;
        }

        .operate {
          position: absolute;
          right: 10px;
          text-align: right;

          i {
            font-size: 18px;
          }
        }
      }

      .item.active {
        color: #00b3ff;
      }
    }
  }
}
</style>
