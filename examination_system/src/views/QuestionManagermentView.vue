<template>

  <!-- 当前页展示的信息在displayData、所有的信息在historyData。主要区别在于是否经过搜索或分页 -->
  <div class="find">
    <div class="select">
      <p>试题列表</p>
      <div class="select-opt" :class="{'active':active===-1}" @click=switchActive2()>震撼-资伍组</div>
      <div class="select-opt" v-for="(opt,index) in options" :key="index" :class="{'active':active===index}" @click="switchActive(index)">
        {{ opt }}
      </div>
    </div>
    <el-dialog :title="isAdd ? '添加试题' : '修改试题'" v-model="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addQuestionFrom" :rules="addQuestionFromRules" ref="addQuestionFromRef" label-width="70px">
        <el-form-item label="试题概览" prop="overview"> <!-- prop是验证规则属性 -->
          <el-input v-model="addQuestionFrom.overview" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="题型" prop="type"> <!-- prop是验证规则属性 -->
          <el-input v-model="addQuestionFrom.type" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="候选答案" prop="candidateAns">
          <el-input v-model="addQuestionFrom.candidateAns" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="rightAns">
          <el-input v-model="addQuestionFrom.rightAns" @input="change($event)"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit()">确 定</el-button>
        </span>
    </el-dialog>

    <el-col :span="4">
      <el-button type="primary" @click="handleAdd">添加试题</el-button>
    </el-col>
    <div class="search">
      <input type="text" placeholder="搜索" v-model="state.searchValue">
      <img src="../assets/search.png">
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>试题概览</th>
        <th>题型</th>
        <th>图片</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item,index) in displayData" :key="item.id">
        <td>{{ item.text }}</td>
        <td>{{ item.type }}</td>
        <td class="img-td"><img :src="item.imageUrls != null ? item.imageUrls : 'https://dimg04.c-ctrip.com/images/zc0a170000011f8t5F2C8.jpg'" alt="试题图片"></td>

        <td>
          <a href="#" @click.prevent="handleEditing(index)" style="color: #87CEFA;">
            <img src="../assets/xiu_gai2.png" alt="Edit" width="16" height="16"> 修改
          </a>
          <span>&nbsp;</span> <!-- 添加一个空格 -->
          <span>&nbsp;</span> <!-- 添加一个空格 -->
          <span>&nbsp;</span> <!-- 添加一个空格 -->
          <span>&nbsp;</span> <!-- 添加一个空格 -->
          <span>&nbsp;</span> <!-- 添加一个空格 -->
          <span>&nbsp;</span> <!-- 添加一个空格 -->
          <a href="#" @click="deleteQuetion(item.id)" style="color: #87CEFA;">
            <img src="../assets/delete3.png" alt="Delete" width="16" height="16"> 删除
          </a>
        </td>
      </tr>
    </tbody>
  </table>

  <el-pagination 
    :hide-on-single-page="false" 
    v-model:current-page="state.pageNum" 
    :page-sizes="[10]"
    v-model:page-size="state.pageSize" 
    layout="total, sizes, prev, pager, next, jumper" 
    :total="state.totalNumber"
    @size-change="handleSizeChange" 
    @current-change="handleCurrentChange" 
    style="float:right">
  </el-pagination>

</template>

<script>
// 引入 Axios 库
import axios from "axios";
import {constant} from "@/stores/constant";
import {store} from "@/stores/store";
import { ElMessage } from 'element-plus';

export default{
  data(){
    return{
      // options: ["资伍组","郑汉","震撼"],
      timer: null,//延时器
      displayData: [],
      active: -1,
      isAdd: false,
      state:{
        pageNum: 1,
        pageSize: 10,
        createTimeEnd: "",
        createTimeStart: "",
        searchValue: "",
        totalNumber: 24,    //n
      },
      searchKeys: ["text", "type", "imageUrls"],
      historyData: [],
      addDialogVisible: false, //控制添加对话框的显示与隐藏
      addQuestionFrom:{},
      addQuestionFromRules: {
        text:[{required:true,message:'请输入题干',trigger:'blur'}],
        type: [{required:true,message:'请输入题型',trigger:'blur'}],
        candidateAns: [{required:true,message:'请输入候选答案',trigger:'blur'}],
        rightAns: [{required:true,message:'请输入正确答案',trigger:'blur'}],
      },
      change(e){
        this.$forceUpdate()
      },
    }
  },
  methods:{
    handleEditing(index, event){
      this.addDialogVisible = true
      this.isAdd = false
      this.addQuestionFrom = this.displayData[index]
    },
    handleAdd(event){
      this.addDialogVisible = true
      this.isAdd = true
    },
    handleSizeChange(){
      console.log("The size of page changed")
    },
    handleCurrentChange(){
      console.log("The current page changed")
    },
    goToPaper(){
      this.$router.push({name: 'home'})
    },
    switchActive(idx){
      this.active=idx
    },
    switchActive2(){
      this.active=-1
    },
    //监听添加用户对话框的关闭状态
    addDialogClosed(){
      this.$refs.addQuestionFromRef.resetFields();
      this.getQuestionList()
    },
    handleSubmit(){
      if(this.isAdd)
        this.addQuesion()
      else this.updateQuestion()
    },
    async getQuestionList(){
      try {
        const queryParams = {
          page: 1,
          pageSize: 1000
        }
        const ret = await axios.get(`${constant.host}/user/question/page`, {params: queryParams})
        if(ret.data.code != 1){
          ElMessage.error(ret.data.msg)
        }
        this.historyData = ret.data.data.records//总数
      } catch(error) {
        ElMessage.error(error)
      }
    },
    // 点击按钮，添加新用户
    async addQuesion(){
      await this.$refs.addQuestionFromRef.validate(async valid =>{
        if(!valid) return;//校验没通过，返回
        try {
          const headersConfig = {
            headers: {
              'Content-Type': 'application/json', // 根据你的API要求设置正确的Content-Type
              'Token': `${store.user.token}` // 通常Token以Bearer开头
            }
          }
          const ret = await axios.post(`${constant.host}/user/question`, this.addQuestionFrom, headersConfig)
          if(ret.data.code != 1){
            ElMessage.error(ret.data.msg)
          }
          else{
            // 隐藏添加用户的对话框
            ElMessage.success("添加成功")
            this.addDialogVisible = false;
            //重新获取用户列表数据
            this.getQuestionList();
          }
        } catch(error) {
          ElMessage.error(error)
        }
      })
    },
    async updateQuestion() {
      await this.$refs.addQuestionFromRef.validate(async valid =>{
        if(!valid) return;//校验没通过，返回
        try {
          const headersConfig = {
            headers: {
              'Content-Type': 'application/json', // 根据你的API要求设置正确的Content-Type
              'Token': `${store.user.token}` // 通常Token以Bearer开头
            }
          }
          const ret = await axios.put(`${constant.host}/user/question`, this.addQuestionFrom, headersConfig)
          if(ret.data.code != 1){
            ElMessage.error(ret.data.msg)
          }
          else{
            // 隐藏添加用户的对话框
            ElMessage.success("修改成功")
            this.addDialogVisible = false;
            //重新获取用户列表数据
            this.getQuestionList();
            
          }
        } catch(error) {
          ElMessage.error(error)
        }
      })
    },
    async deleteQuetion(targetId) {
      try {
        const headersConfig = {
          headers: {
            'Content-Type': 'application/json', // 根据你的API要求设置正确的Content-Type
            'Token': `${store.user.token}` // 通常Token以Bearer开头
          }
        }
        const ret = await axios.delete(`${constant.host}/user/question${targetId}`, headersConfig)
        console.log(JSON.stringify(ret))
        this.historyData = this.historyData.filter((item) => item.id != targetId)
      } catch(error) {
        ElMessage.error("error")
      }
    },
  },
  computed: {
    pageOrHistoryDataChanged() {
      const {historyData, state} = this
      return {historyData, state}
    }
  },
  watch: {
    pageOrHistoryDataChanged: {
      deep: true,
      handler() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          console.log("disp")
          let data
          if(this.active>-1){
            let subjectData=[];
            for(let i=0;i<this.historyData.length;i++)
              if(this.options[this.active] === this.historyData[i].subject)
                subjectData.push(this.historyData[i])
            data=subjectData
          }
          else
            data=this.historyData

          if(this.state.searchValue){
            let searchData=[]
            
            for(let i=0;i<data.length;i++)
             
              for(let key of this.searchKeys){
                let it
                if(typeof data[i][key] === "number")
                  it=String(data[i][key])
                else
                  it=data[i][key]
                if(it.includes(this.state.searchValue)){
                  searchData.push(data[i])
                  break
                }
              }
            data=searchData
          }
         
          this.displayData = data.slice((this.state.pageNum-1)*this.state.pageSize , this.state.pageNum*this.state.pageSize)
          this.state.totalNumber = data.length
        }, 300)
      }
      
    }
  },
  async created() {
    await this.getQuestionList()
  }
}
</script>

<style>

.find{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 70px;
  margin-bottom:10px;
}

.find .select{
  display: flex;
}

.find .select p{
  font-size:18px;
}

.select-opt{
  font-size:18px;
  height:33px;
  margin-left:20px;
  border: 1px solid grey;
  border-radius: 5px;
  padding-left:10px;
  padding-right:10px;
}

.select-opt:hover{
  background-color: #E1E1E1;
  transition: 0.3s;
}

.active{
  background-color: #409EFF;
  color:#fff;
}

.active:hover{
  background-color: #1D91E8;
}

.search{
  display: flex;
  align-items: center;
  margin-right:240px;
}

.search input{
  font-size: 18px;
  padding: 10px;
  padding-left:40px;
  width: 250px;
  border: 2px solid white;
  border-radius: 30px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-right: -240px;
}

.search img{
  width: 30px;
}

table{
  margin: 70px;
  margin-bottom: 20px;
  margin-top: 20px;
}

table th{
  font-size: 20px;
  background-color: #F4F6F8;
  height: 60px;
}

table td{
  font-size: 18px;
  text-align: center;
  height: 40px;
}

table tr:hover{
  background-color: #F6F6F6;
}

.el-pagination {
  margin: auto;
  margin-top: 20px;
}
img {
  place-items: center;
  max-width: 80%;
  max-height: 80%;
}

.img-td{
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>