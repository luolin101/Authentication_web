<template>
    <el-menu :default-openeds="['1', '3']" style="min-height: 100%;overflow-x: hidden" background-color="rgb(48,65,80)" text-color="rgb(255,255,255)" active-text-color="#ffd04b" :collapse="isCollapse" router>
      <div v-show="title" style="height: 60px;line-height: 60px;text-align: center">
        <b style="color: white">文件管理系统(管理员端)</b>
      </div>
      <el-submenu index="1">
        <template #title>
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </template>
        <el-menu-item-group>
          <!--              <template slot="title">个人信息</template>-->
          <el-menu-item index="/PersonManage2">用户信息管理</el-menu-item>
          <el-menu-item index="/home">文件管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>


<!--      <el-submenu index="2">-->
<!--        <template slot="title">-->
<!--          <i class="el-icon-menu"></i>-->
<!--          <span slot="title">我的课程</span>-->
<!--        </template>-->
<!--        <el-menu-item-group>-->
<!--          &lt;!&ndash;              <template slot="title">分组一</template>&ndash;&gt;-->
<!--          <el-menu-item index="/TeacherScore">学生成绩查询</el-menu-item>-->
<!--          <el-menu-item index="/SubmitScore">学生成绩上传</el-menu-item>-->
<!--        </el-menu-item-group>-->
<!--      </el-submenu>-->


    </el-menu>

</template>

<script>
export default {
  name: "Aside",
  props:{
    title:Boolean,
    isCollapse:Boolean,

  }

}
</script>

<style scoped>

</style>
