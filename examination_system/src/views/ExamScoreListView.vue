<template>

  <!-- 当前页展示的信息在displayData、所有的信息在historyData。主要区别在于是否经过搜索或分页 -->
  <div class="find">
    <div class="select">
      <p>{{ this.$route.query.ename }}分数列表</p>
    </div>

    <div class="search">
      <input type="text" placeholder="搜索" v-model="state.searchValue">
      <img src="../assets/search.png">
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>用户名称</th>
        <th>用户头像</th>
        <th>分数</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in displayData" :key="item.id">
        <td>{{ item.username }}</td>
        <td class="img-td"><img :src="item.imageUrl != null ? item.imageUrl : 'https://dimg04.c-ctrip.com/images/zc0a170000011f8t5F2C8.jpg'" alt="用户头像"></td>
        <td>{{ item.score }}</td>
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
      state:{
        pageNum: 1,
        pageSize: 10,
        createTimeEnd: "",
        createTimeStart: "",
        searchValue: "",
        totalNumber: 24,    //n
      },
      searchKeys: ["username", "score"],
      historyData: [],

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

    async getScoreList(){
      try {
        const queryParams = {
          examId: this.$route.query.eid,
          keyword: '',
          page: 1,
          pageSize: 1000
        }
        const ret = await axios.get(`${constant.host}/user/exam/score/page`, {params: queryParams})
        if(ret.data.code != 1){
          ElMessage.error(ret.data.msg)
        }
        this.historyData = ret.data.data.records//总数
      } catch(error) {
        ElMessage.error(error)
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
    await this.getScoreList()
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