<template>
  <div>
    <!-- <el-form :inline="true" :model="checkForm" class="loginContainer">
      <el-form-item label="用户名">
        <el-input type="text" auto-complete="false" v-model="checkForm.username"></el-input>
      </el-form-item>
      <el-button type="success" >查询</el-button>
    </el-form> -->
    <div style="margin: 10px 0">
      <el-input v-model="search" placeholder="请输入关键字" style="width: 20%" clearable></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="load">查询</el-button>
    </div>
    <div id="addUser">
      <div class="add">新增用户</div>
      <div class="add">
        <el-button type="primary" @click="AddUser">单个添加</el-button>
      </div>
      <div class="add">
        <el-upload
            class="upload-demo"
            action="http://localhost:9090/getExcel"
            :on-success="successUpload"
        >
          <el-button type="primary">批量添加</el-button>
          <!--          <i class="el-icon-upload"></i>-->
          <!--          <div class="el-upload__text">批量新增用户？将Excel文件拖到此处，或<em>点击上传</em></div>-->

        </el-upload>
      </div>
      <div id="addtext">只能上传xls/xlsx文件</div>
    </div>

    <div id="set">
      <div class="setMode">配置登录方式</div>
      <div id="mode">
        <el-select v-model="newmode" multiple placeholder="请选择" style="width: 300px">
          <el-option
              v-for="item in loginmode"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="setMode"><el-button type="success" @click="submitMode">提交</el-button></div>
    </div>

    <el-table 
    :data="tableData" 
    style="width: 100%" 
    height="309px" 
    stripe
    :cell-style="{padding:'5px',height:'50px'}" 
    v-loading="loading">
      <el-table-column fixed prop="id" label="id" width="120">
      </el-table-column>
      <el-table-column  prop="username" label="用户名" width="120">
      </el-table-column>
      <el-table-column prop="pwd" label="密码" width="220">
      </el-table-column>
      <el-table-column prop="serial" label="序列号" width="220" >
        
      </el-table-column>


      <el-table-column prop="otpSk" label="动态口令密钥" width="220">
        
      </el-table-column>
      <el-table-column label="操作">
        <template  #default="scope">
          <el-button type="success" @click="change(scope.row)" style="padding: 10px" icon="el-icon-edit"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

    <el-dialog title="修改信息"  v-model="ChangeVisible" width="30%">
      <el-form ref="changeform" :rules="rules" :model="changeform" label-width="80px">
        <el-form-item label="id">
          <el-input v-model="changeform.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="changeform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="changeform.pwd"></el-input>
        </el-form-item>
        <el-form-item label="序列号">
          <el-input v-model="changeform.serial" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="UKEY密钥">
          <el-input v-model="changeform.ukeyPk" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="otp密钥" prop="otpSk">
          <el-input v-model="changeform.otpSk" ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
       <el-button @click="ChangeVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitChange">确 定</el-button>
      </span>
    </template>
      
    </el-dialog>

    <el-dialog title="新增用户"  v-model="AddVisible" width="30%">
      <el-form ref="addform" :rules="rules" :model="addform" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="addform.pwd" ></el-input>
        </el-form-item>
        <el-form-item label="序列号">
          <el-input v-model="addform.serial" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="UKEY密钥">
          <el-input v-model="addform.ukeyPk" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="otp密钥" prop="otpSk">
          <el-input v-model="addform.otpSk" ></el-input>
        </el-form-item>

      </el-form>
      <template #footer>
      <span class="dialog-footer">
       <el-button @click="AddVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>

    </el-dialog>

  </div>

</template>

<script>
import request from "@/utils/request";
export default {
  name: "PersonManage2",
  data(){
    return{
      loading: true,
      editAdd: false,
      newRow:{},
      userNum:0,
      changeID:0,
      changeMsg:'修改信息',
      checkForm:{
        id:'',
        username:''
      },
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      loginmode:[
        {value:1,label:"用户名口令登录"},
        {value:2,label:"UKEY登录"},
        {value:3,label:"动态口令登录"},
        {value:4,label:"APP扫码登录"},
      ],
      choosedmode:[],
      newmode:[],
      otp:true,
      ChangeVisible:false,
      AddVisible:false,
      changeform:{
        id:'',
        username:'',
        pwd:'',
        serial:'',
        ukeyPk:'',
        otpSk:''
      },
      addform:{
        id:'',
        username:'',
        pwd:'',
        serial:'',
        ukeyPk:'',
        otpSk:''
      },
      rules:{
        username:[{required:true,message:'请输入用户名',trigger:'blur'}],
        pwd:[{required:true,message:'请输入密码',trigger:'blur'}],
        otpSk:[{required:true,message:'请输入otp密钥',trigger:'blur'}],
      }
    }
  },
  created() {
   this.selectMode();
   this.init();
   this.load()
  },
  methods:{
    selectMode(){
      request.get("/mode/getChoosed").then(res => {
        if(!res){
          alert("...");
        }else{
          this.choosedmode=res;
          this.newmode=res;
          if(this.choosedmode.includes(3)){
            this.otp=false;
          }else{
            this.otp=true;
          }
          console.log(res)
        }
      });
    },
    init(){
      request.get("/user/getUserNum").then(res => {
      if(!res){
        alert("...");
      }else{
        this.userNum=res;
        console.log(res)
      }
    });
    },
    load() {
      this.loading = true
      request.get("/user", {
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
    select(){
      if(this.checkForm.id==''){
        request.get("/user/getUserPage?id=0&username="+this.checkForm.username+"&pageNum="+this.currentPage+"&pageSize=5").then(res => {
          if(!res){

          }else{
            this.totalpage=res.total;
            this.tableData=res.list;
          }
        });

      }else{
       request.get("/user/getUserPage?id="+this.checkForm.id+"&username="+this.checkForm.username+"&pageNum="+this.currentPage+"&pageSize=5").then(res => {
          if(!res){
          }else{
            this.totalpage=res.total;
            this.tableData=res.list;

          }
        });
      }
    },
    selectAll(){
      request.get("/user/getAllUser").then(res => {
        if(!res){
          alert("...");
        }else{
          this.tableData=res;
          console.log(res)
        }
      });
    },
    AddUser(){
      this.AddVisible=true;
    },
    submit(){
      this.$refs.addform.validate((valid) => {
        if (valid) {
          request.post("/user/addOneUser",this.addform).then(res => {
            if(!res){
              alert("...");
            }else{
              if(res){
                this.load();
                this.AddVisible=false;
                alert('添加成功！')
              }
              else{
                alert('添加失败')
              }
              console.log(res)
            }
          });
        } else {
          // this.$message.error('请输入所有字段！');
          this.$message({
            showClose: true,
            message: '请输入所有字段！',
            type: 'error'
          });
          return false;
        }
      });
    },
    change(row){
      this.ChangeVisible=true;
              this.changeform.id=row.id
              this.changeform.username=row.username
              this.changeform.pwd=row.pwd
              this.changeform.serial=row.serial
              this.changeform.ukeyPk=row.ukeyPk
              this.changeform.otpSk=row.otpSk
              console.log(this.changeform)

    },
    remove(id){
      console.log(id);
      request.get("/user/removeOneUser?id="+id).then(res => {
        if(!res){
          alert("...");
        }else{
          if(res){
            this.load();
            this.$message.success('删除成功')
          }
          else{
            alert('删除失败')
          }
          console.log(res)
        }
      });

    },
    cancelAdd(){
      this.load();
      this.editAdd=false;

    },
    submitChange(){
      this.$refs.changeform.validate((valid) => {
        if (valid) {
          request.post("/user/changeUser",this.changeform).then(res => {
            if(!res){
              alert("修改失败");
            }else{
              alert("修改成功！")
              this.load();
              this.ChangeVisible=false;
              console.log(res)
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: '请输入所有字段！',
            type: 'error'
          });
          return false;
        }
      });

    },
    successUpload(response){
      console.log("response:"+response.num+","+response.state+","+response.errormsg)
      if(response.state){
        alert("添加成功！成功添加了"+response.num+"位用户")
        this.load();
      }else{
        alert(response.errormsg);
      }


    },
    handleSizeChange(pageSize) {   // 改变当前每页的个数触发
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {  // 改变当前页码触发
      this.currentPage = pageNum
      this.load()
    },
    submitMode(){
      console.log("原来："+this.choosedmode);
      console.log("现在："+this.newmode);
      var oldnum=this.choosedmode.length;
      var newnum=this.newmode.length;
      var oldMode=[];
      var newMode=[];
      console.log(oldnum+";"+newnum);

      for(var i=0;i<oldnum;i++){
        if(!this.newmode.includes(this.choosedmode[i])){
          oldMode.push(this.choosedmode[i]);
        }
      }
      for(var j=0;j<newnum;j++){
        if(!this.choosedmode.includes(this.newmode[j])){
          newMode.push(this.newmode[j]);
        }
      }
      console.log("新增："+newMode);
      console.log("减少："+oldMode);
      request.get("/mode/changeMode?newMode="+newMode+"&oldMode="+oldMode).then(res => {
        if(res==""){
          this.$message.success("修改成功")
          this.selectMode();
          if(oldMode.includes(2)){
            this.setUkeyUser(0);
          }
          if(newMode.includes(2)){
            this.setUkeyUser(1);
          }
          console.log(res)
        }else{

          alert("no")
          console.log(res)
        }
      });

    },
    setUkeyUser(state){
      request.get("/user/setUKEYUser?state="+state).then(res => {
        if(res){
          console.log(res)
        }else{
          alert("配置失败")
          console.log(res)
        }
      });
    }

  }
}
</script>

<style>
  .add{
    height: 50px;
    width: 100px;
    line-height: 50px;
    text-align: center;
    float: left;
  }
  .setMode{
    height: 50px;
    width: 100px;
    line-height: 50px;
    text-align: center;
    float: left;
  }
  #mode{
    height: 80px !important;
    width: 300px !important;
    line-height: 50px;
    text-align: center;
    float: left;
  }
  #addUser{
    height: 50px;
    width: 500px;
  }
  #set{
    height: 80px;
    width: 500px;
  }
  #addtext{
    height: 50px;
    width: 200px;
    line-height: 50px;
    /*text-align: center;*/
    float: left;
    font-size: 10px;

  }



</style>
