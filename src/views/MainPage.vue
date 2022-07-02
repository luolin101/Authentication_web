<template>
  <div id="person_inf">

    <el-container style="min-height: 100vh">
      <el-aside :width="asideWidth+'px'" style="background-color: rgb(238, 241, 246)">
          <AsideTeacher :title="title" :isCollapse="isCollapse"></AsideTeacher>
      </el-aside>

      <el-container>
        <el-header style="font-size: 12px;border-bottom: 1px solid gray;line-height: 60px;display: flex">
          <div style="flex:1;font-size: 20px">
            <span :class="shrinkBtn" style="cursor: pointer" @click="shrink"></span>
          </div>
        </el-header>
        <el-main>

          <router-view></router-view>

        </el-main>
      </el-container>

    </el-container>
  </div>

</template>

<script>
import AsideTeacher from "../components/AsideTeacher.vue";
export default {
  name: "Information",
  data() {
    return {
      shrinkBtn: "el-icon-s-fold",
      isCollapse:false,
      asideWidth:200,
      title:true,
      show:false,
      who:'',

    }
  },
  created() {
    
  },
  components:{
    AsideTeacher
  },

  methods:{
    shrink(){
      this.isCollapse=!this.isCollapse;
      this.title=!this.title;
      if(this.isCollapse){
        this.asideWidth=64;
        this.shrinkBtn="el-icon-s-unfold";
      }else{
        this.asideWidth=200;
        this.shrinkBtn="el-icon-s-fold";
      }
    }
  }
}
</script>

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }


</style>
