<template>
  <div class="error-404-wrapper">
    <h2 class="title">您的页面飞走了……</h2>
    <img :src="error_404_img" />
  </div>
</template>

<script>
export default {
  name: '404',
  props: {},
  components: {},
  data () {
    return {
      error_404_img: require('@/assets/images/error/404.jpeg')
    }
  },
  watch: {},
  computed: {},
  created () {
  },
  mounted () {
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.error-404-wrapper {
  display: initial !important;
  padding: 100px 0;
  text-align: center;

  .title {
    padding-bottom: 20px;
  }
}
</style>
