<template>
  <div style="padding: 10px">
    <!--    功能区域-->
    <div style="margin: 10px 0">
      <el-upload ref="upload" :action="filesUploadUrl" :headers="headerObj" :on-success="filesUploadSuccess">
              <el-button type="primary">点击上传</el-button>
      </el-upload>
    </div>

    <!--    搜索区域-->
    <div style="margin: 10px 0">
      <el-input v-model="search" placeholder="请输入关键字" style="width: 20%" clearable></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="load">查询</el-button>
    </div>
    <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="id"
          label="ID"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="fname"
          label="名称">
      </el-table-column>

      <el-table-column
          prop="owner"
          label="上传者">
      </el-table-column>

 
      <el-table-column label="操作" width="240">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="down(scope.row.url,scope.row.fname)">下载</el-button>
          <!-- <el-button size="mini" @click="handleEdit(scope.row)" v-if="user.roles[0] === 1">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import axios from "axios";
export default {
data() {
    return {
      user: {},
      loading: true,
      form: {},
      dialogVisible: false,
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      filesUploadUrl: "http://localhost:9090/files/upload",
      ids: [],
      headerObj: {
        Authorization:'',
        token: ''
      },
    }
  },
  created() {
    let userStr = sessionStorage.getItem("user") || "{}"
    this.user = JSON.parse(userStr)
    this.myToken=this.user.token
    this.headerObj.token=this.myToken
    this.load()
  },
  methods: {
    handleSelectionChange(val) {
      this.ids = val.map(v => v.id)   // [{id,name}, {id,name}] => [id,id]
    },
    filesUploadSuccess(res) {
      this.$message.success("上传成功");
      this.load()
    },
    load() {
      this.loading = true
      request.get("/files", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(res => {
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
        console.log(this.tableData)
      })
    },
    add() {
      if (this.$refs['upload']) {
        this.$refs['upload'].clearFiles()  // 清除历史文件列表
      }
    },
    down(url,fname){
      axios({
        method: "get",
        url: "http://localhost:8090/api/files/"+url, //后端下载接口地址
        responseType: "blob",  // 设置接受的流格式
        headers: {					// 配置请求头，若统一处理可省略
          Accept: 'application/octet-stream',    
          token: this.myToken,             // 获取token，这里假定 myToken
        },
      }).then((res) => {
        // res 中还有一层data ,如果直接用blob流，文件里面是object，我就是犯错了。
        this.handleExport(res.data,fname);
      });
    },
    handleExport(data,fname) {
      // 动态创建iframe下载文件
      let fileName = fname;
      if (!data) {
        return;
      }
      let blob = new Blob([data], { type: "application/octet-stream" });
      if ("download" in document.createElement("a")) {
        // 不是IE浏览器
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // 下载完成移除元素
        window.URL.revokeObjectURL(url); // 释放掉blob对象
      } else {
        // IE 10+
        window.navigator.msSaveBlob(blob, fileName);
      }
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs['upload']) {
          this.$refs['upload'].clearFiles()  // 清除历史文件列表
        }
      })

    },
    handleDelete(id) {
      console.log(id)
      request.delete("/book/" + id).then(res => {
        if (res.code === '0') {
          this.$message({
            type: "success",
            message: "删除成功"
          })
        } else {
          this.$message({
            type: "error",
            message: res.msg
          })
        }
        this.load()  // 删除之后重新加载表格的数据
      })
    },
    handleSizeChange(pageSize) {   // 改变当前每页的个数触发
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {  // 改变当前页码触发
      this.currentPage = pageNum
      this.load()
    }
  }
}
</script>

<style>

</style>