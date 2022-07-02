<template>
  <div></div>
  <!--<viewer :options="options" :images="imageUrlList"-->
  <!--        @inited="inited"-->
  <!--        class="viewer images" ref="viewer"-->
  <!--&gt;-->
  <!--  <template slot-scope="scope">-->
  <!--    <img v-for="(item,index) in scope.imageList" :src="setFileImg(item)"-->
  <!--         :data-source="getRowImageSrc(item)"-->
  <!--         :key="index">-->
  <!--    {{ scope.options }}-->
  <!--  </template>-->
  <!--</viewer>-->
  <!--<div class="images viewer" v-viewer="{movable: false}" @inited="inited">-->
  <!--  <img v-for="(item,index) in imageList"-->
  <!--       :data-source="getRowImageSrc(item)"-->
  <!--       :src="setFileImg(item)" :key="index">-->
  <!--</div>-->

</template>
<script>
// import { directive as viewer } from 'v-viewer'
import 'viewerjs/dist/viewer.css'
// eslint-disable-next-line import/no-duplicates
// import Viewer from 'v-viewer'
// import Vue from 'vue'

// Viewer.setDefaults({
//   url: 'data-source', // 大图地址参数
//   filter (image) {
//     // 只有大图的才能放大
//     const dataSource = image.getAttribute('data-source')
//     if (dataSource == null || dataSource == undefined) {
//       return false
//     } else {
//       return true
//     }
//   }
// })
// Vue.use(Viewer)
const sourceImages = []
const base = Math.floor(Math.random() * 60) + 10
for (let i = 0; i < 10; i++) {
  sourceImages.push({
    thumbnail: `https://picsum.photos/id/${base + i}/346/216`,
    source: `https://picsum.photos/id/${base + i}/1440/900`,
    alt: `Image: ${base + i}`
  })
}
export default {
  components: {
    // Viewer
  },
  props: {},
  data () {
    return {
      visible: false,
      imageUrlList: [],
      imageList: [],
      form: {
        view: 2,
        zoom: -0.1,
        zoomTo: 0.8,
        rotate: 90,
        rotateTo: 180,
        scaleX: 1,
        scaleY: 1
      },
      toggleOptions: [
        'button',
        'navbar',
        'title',
        'toolbar',
        'tooltip',
        'movable',
        'zoomable',
        'rotatable',
        'scalable',
        'transition',
        'fullscreen',
        'keyboard'
      ],
      options: {
        inline: false, // 启用inline模式
        button: false, // 显示右上角关闭按钮
        navbar: true, // 显示缩略图导航
        title: false, // 显示当前图片的标题
        toolbar: false, // 显示工具栏
        tooltip: true, // 显示缩略百分比
        movable: true, // 图片是否可移动
        zoomable: true, // 图片是否可缩放
        rotatable: true, // 图片是否可旋转
        scalable: true, // 图片是否可反转
        transition: true, // 使用css3过度
        fullscreen: false, // 播放时是否全屏
        keyboard: true //
      },
      images: [...sourceImages].splice(0, 5),
      previewPerfix: '/api/filetransfer/preview?fileName='
    }
  },
  watch: {
    visible (val) {
      if (val) {
        const viewer = this.$el.querySelector('.viewer').$viewer
        viewer.show()
      }
    }
  },
  created () {
    this.imageList = this.imgList
    const that = this
    this.imageUrlList = this.imageList.map(function(item, index, arr) {
      return that.getRowImageSrc(item)
    })
    console.log(this.imageUrlList)
    console.log(this.imageList)
  },
  methods: {
    // 这个初始化会在页面初始的时候就执行一次,后续每次传入图片也会自动执行,所有用来转发事件
    // inited (viewer) {
    //   this.$viewer = viewer
    //   this.$emit('getViewer', viewer)
    // },
    inited (viewer) {
      this.$viewer = viewer
    },
    add () {
      this.images.push(sourceImages[this.images.length])
    },
    remove () {
      this.images.pop()
    },
    view () {
      if (this.form.view >= 0 && this.form.view < this.images.length) {
        this.$viewer.view(this.form.view)
      }
    },
    zoom (value) {
      this.$viewer.zoom(value || this.form.zoom)
    },
    zoomTo () {
      this.$viewer.zoomTo(this.form.zoomTo)
    },
    rotate (value) {
      this.$viewer.rotate(value || this.form.rotate)
    },
    rotateTo () {
      this.$viewer.rotateTo(this.form.rotateTo)
    },
    scaleX (value) {
      if (value) {
        this.$viewer.scaleX(value)
      } else {
        this.form.scaleX = -this.form.scaleX
        this.$viewer.scaleX(this.form.scaleX)
      }
    },
    scaleY (value) {
      if (value) {
        this.$viewer.scaleY(value)
      } else {
        this.form.scaleY = -this.form.scaleY
        this.$viewer.scaleY(this.form.scaleY)
      }
    },
    move (x, y) {
      this.$viewer.move(x, y)
    },
    prev () {
      this.$viewer.prev()
    },
    next () {
      this.$viewer.next()
    },
    play () {
      this.$viewer.play()
    },
    stop () {
      this.$viewer.stop()
    },
    show () {
      this.$viewer.show()
    },
    full () {
      this.$viewer.full()
    },
    tooltip () {
      this.$viewer.tooltip()
    },
    reset () {
      this.$viewer.reset()
    },
    toggleInline (inline) {
      this.options.inline = inline
    }
  }
}
</script>
<style lang="less" scoped>
.images {
  position: fixed;
  width: 100%;
  height: 100%;
  //background-color: #000000;
  //opacity: 0.7;
  left: 0;
  //top: 0;
  right: 0;
  bottom: 0;
  //display: flex;
  flex-flow: row;
  z-index: 1999;
  transition: bottom 0.5s ease;
}

.viewer-wrapper {
  position: relative;
  background: #333;
  height: 100%;
}

.methods {
  margin-bottom: 1em;
  flex-wrap: wrap;

  & > * {
    margin-right: 0.75rem;
  }
}

.options-panel {
  .panel-block {
    padding: 0;

    .checkbox {
      display: block;
      width: 100%;
      margin: 0;
      padding: 0.5em 0.75em;
    }
  }
}

.viewer {
  height: 100%;

  .images {
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 5px;

    .image-wrapper {
      display: inline-block;
      width: calc(33% - 20px);
      margin: 5px 5px 0 5px;

      .image {
        width: 100%;
        cursor: pointer;
        display: inline-block;
      }
    }
  }
}

.viewer {
  width: 700px;
  height: 500px;
}

//.images {
//  width: 100px;
//  height: 100px;
//  margin: 10px;
//}


</style>
