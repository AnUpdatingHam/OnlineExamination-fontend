<template>

  <!-- 当前页展示的信息在displayData、所有的信息在historyData。主要区别在于是否经过搜索或分页 -->
  <div class="find">
    <div class="select">
      <p style="font-size: 28px">{{this.$route.query.ename}}试题列表</p>
    </div>

    <el-col :span="3" style="position: absolute;right: 360px;">
      <el-button type="primary" @click="handleConfirm">确认试题</el-button>
    </el-col>
    <el-col :span="3" style="position: absolute;right: 480px;">
      <el-button type="primary" @click="historyData = originalQuestions">原试题</el-button>
    </el-col>
    <el-col :span="3" style="position: absolute;right: 600px;">
      <el-button type="primary" @click="handleRdSelect">抽取试题</el-button>
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
        <th>候选答案</th>
        <th>正确答案</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in displayData" :key="item.id">
        <td>{{ item.text }}</td>
        <td>{{ item.type === 0 ? '单选题' : item.type === 1 ? '多选题' : '正误题' }}</td>
        <td class="img-td"><img :src="item.imageUrls != null ? item.imageUrls : 'https://img2.baidu.com/it/u=2784875309,3146305990&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=571'" alt="试题图片"></td>
        <td>{{ item.candidateAns }}</td>
        <td>{{ item.rightAnsExpression }}</td>
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
      searchKeys: ["text", "type", "imageUrls", "rightAnsExpression"],
      //以下4种题目数组都是经过转换的
      QuesionsLib: [],//题库
      originalQuestions: [],//该试卷原来的题目
      historyData: [{text:"题干", type:'题型', imageUrls:'https://q3.itc.cn/q_70/images03/20240519/1b4e7565b46241b68288ae482412a866.jpeg', 
      candidateAns:"123", rightAns:"123"}],//所有可能展示的题目
      displayData: [{text:"题干", type:'题型', imageUrls:'https://q3.itc.cn/q_70/images03/20240519/1b4e7565b46241b68288ae482412a866.jpeg', 
      candidateAns:"123", rightAns:"123"}],//当前页展示的题目，自动计算

      change(e){
        this.$forceUpdate()
      },
    }
  },
  methods:{
    handleSizeChange(){
      console.log("The size of page changed")
    },
    handleCurrentChange(){
      console.log("The current page changed")
    },
    handleConfirm() {
      //将historyData中的数据传给后端
    },
    handleRdSelect() {
      let result = []
      let ranNum = Math.min(10, this.QuesionsLib.length) //需要修改
      let arr = this.QuesionsLib;
      for (var i = 0; i < ranNum; i++) {
        let ran = Math.floor(Math.random() * (arr.length - i));
        result.push(arr[ran]);
        arr[ran] = arr[arr.length - i - 1];
      };
      this.historyData = result
    },
    modifyQuestionsData(records) {
      let Data = records
      for (let i = 0; i < Data.length; i++) {
        Data[i].rightAnsArray = Data[i].rightAns.split(' ')
        if(Data[i].type === 10) //是非
        Data[i].rightAnsExpression = Data[i].rightAns[0] == true ? "true" : "false"
        else{
          Data[i].rightAnsExpression = ""
          for (let j = 0; j < Data[i].rightAnsArray.length; j++) {
            if(Data[i].rightAnsArray[j] != 0)
              Data[i].rightAnsExpression += String.fromCharCode(65 + j);
          }
        }
      }
      return Data
    },
    async queryQuestionList(getAll){
      //getAll=true -> 请求整个题库; getAll=false -> 请求当前试卷的题目
      try {
        const queryParams = getAll? {
          majorId: 1, //需要修改
          keyword: '',
          page: 1,
          pageSize: 1000,
        } : {
          examId: this.$router.query.eid,
          keyword: '',
          page: 1,
          pageSize: 1000,
        };
        const apiPath = getAll? `${constant.host}/user/question/page` : `${constant.host}/user/exam/question/page`
        const ret = await axios.get(apiPath, {params: queryParams})
        if(ret.data.code != 1){
          ElMessage.error(ret.data.msg)
        }
        return ret.data.records
      } catch(error) {
        ElMessage.error(error)
        console.log("error", getAll)
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
            for(let i=0;i<this.historyData.length;i++) {
              if (this.options[this.active] === this.historyData[i].subject)
                subjectData.push(this.historyData[i])
            }
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
    let records = await this.queryQuestionList(false)
    this.originalQuestions = this.modifyQuestionsData(records)
    this.historyData = this.modifyQuestionsData(records)
    records = await this.queryQuestionList(true)
    QuesionsLib = this.modifyQuestionsData(records)
  }
}
</script>

<style>

.find{
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  margin: 70px;
  margin-bottom:10px;
}

.find .select{
  display: flex;
  position: absolute;
  left: 170px;
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
  /* margin-right:240px; */
  position: absolute;
  right: 300px;
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