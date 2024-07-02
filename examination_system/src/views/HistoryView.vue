<template>

  <div class="find">
    <div class="select">
      <p>筛选科目</p>
      <div class="select-opt" :class="{'active':active===-1}" @click=switchActive2()>全部</div>
      <div class="select-opt" v-for="(opt,index) in options" :key="index" :class="{'active':active===index}" @click="switchActive(index)">
        {{ opt }}
      </div>
    </div>
    <div class="search">
      <input type="text" placeholder="搜索" v-model="search">
      <img src="../assets/search.png">
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>试卷名</th>
        <th>科目</th>
        <th>年级</th>
        <th>考试类型</th>
        <th>页数</th>
        <th>题数</th>
        <th>参考答案</th>
        <th>生成时间</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item,index) in displayData" :key="item.index" @click="goToPaper">
        <td>{{ item.name }}</td>
        <td>{{ item.subject }}</td>
        <td>{{ item.grade }}</td>
        <td>{{ item.exam }}</td>
        <td>{{ item.pageNumber }}</td>
        <td>{{ item.problemNumber }}</td>
        <td>{{ item.answer }}</td>
        <td>{{ item.time }}</td>
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
import axios from 'axios';

// 定义一个异步函数来发送 GET 请求
async function getUser() {
  try {
    // 使用 Axios 发送 GET 请求
    //测试获取id为1的用户数据
    const response = await axios.get('http://localhost:8080/user/user/1');
    // 请求成功，'response' 包含了请求的结果
    console.log(response.data); // 打印请求返回的数据
  } catch (error) {
    // 请求失败，捕获并处理错误
    console.error('Error fetching data:', error);
  }
}
//getUser();

// 定义要发送的数据
const userData = {
  id: '1',
  username: 'newUserName',
  phone: '123456789',
  email: 'newEmail'
  // 其他用户属性...
};

// 定义一个异步函数来发送 PUT 请求，更改对应id的用户信息
async function updateUser() {
  try {
    // 使用 Axios 发送 POST 请求，并包含 JSON 数据
    const response = await axios.put('http://localhost:8080/user/user', userData, {
      // 设置请求头，指明内容类型为 JSON
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // 请求成功，打印响应数据
    console.log(response.data);
  } catch (error) {
    // 请求失败，捕获并处理错误
    console.error('Error update user:', error);
  }
}
updateUser();

export default{
  data(){
    return{
      options: ["语文","数学","英语"],
      active: -1,
      search: '',
      state:{
        pageNum: 1,
        pageSize: 10,
        createTimeEnd: "",
        createTimeStart: "",
        searchValue: "",
        totalNumber: 24,    //n
      },
      historyData:[         //n组数据
        { name: "未命名22", subject: '语文',  grade: '高三', exam: '高考', pageNumber: 3, problemNumber: 34, answer: '有', time: "2024.5.6"},
        { name: "未命名21", subject: '英语',  grade: '初二', exam: '中考', pageNumber: 5, problemNumber: 44, answer: '无', time: "2024.5.1"},
        { name: "未命名23", subject: '数学',  grade: '高一', exam: '高考', pageNumber: 3, problemNumber: 10, answer: '有', time: "2024.4.28"},
        { name: "未命名24", subject: '语文',  grade: '初三', exam: '中考', pageNumber: 3, problemNumber: 30, answer: '有', time: "2024.4.28"},
        { name: "未命名25", subject: '英语',  grade: '高一', exam: '高考', pageNumber: 5, problemNumber: 44, answer: '无', time: "2024.4.28"},
        { name: "未命名26", subject: '数学',  grade: '高一', exam: '高考', pageNumber: 2, problemNumber: 12, answer: '有', time: "2024.4.21"},
        { name: "未命名27", subject: '语文',  grade: '初三', exam: '中考', pageNumber: 3, problemNumber: 30, answer: '有', time: "2024.4.21"},
        { name: "未命名28", subject: '英语',  grade: '初二', exam: '中考', pageNumber: 5, problemNumber: 50, answer: '无', time: "2024.4.21"},
        { name: "未命名29", subject: '数学',  grade: '高一', exam: '高考', pageNumber: 2, problemNumber: 12, answer: '有', time: "2024.4.19"},
        { name: "未命名20", subject: '语文',  grade: '初一', exam: '中考', pageNumber: 3, problemNumber: 28, answer: '有', time: "2024.4.19"},
        { name: "未命名32", subject: '英语',  grade: '初二', exam: '中考', pageNumber: 5, problemNumber: 44, answer: '无', time: "2024.4.19"},
        { name: "未命名34", subject: '数学',  grade: '高一', exam: '高考', pageNumber: 2, problemNumber: 14, answer: '有', time: "2024.4.16"},
        { name: "未命名36", subject: '英语',  grade: '高二', exam: '高考', pageNumber: 3, problemNumber: 30, answer: '有', time: "2024.4.10"},
        { name: "未命名11", subject: '英语',  grade: '初二', exam: '中考', pageNumber: 5, problemNumber: 45, answer: '有', time: "2024.4.10"},
        { name: "未命名12", subject: '数学',  grade: '初二', exam: '中考', pageNumber: 2, problemNumber: 12, answer: '无', time: "2024.4.10"},
        { name: "未命名13", subject: '语文',  grade: '初三', exam: '中考', pageNumber: 3, problemNumber: 30, answer: '有', time: "2024.4.10"},
        { name: "未命名14", subject: '英语',  grade: '初二', exam: '中考', pageNumber: 5, problemNumber: 40, answer: '无', time: "2024.4.10"},
        { name: "未命名15", subject: '数学',  grade: '初三', exam: '中考', pageNumber: 2, problemNumber: 12, answer: '有', time: "2024.4.10"},
        { name: "未命名16", subject: '语文',  grade: '初三', exam: '中考', pageNumber: 3, problemNumber: 32, answer: '无', time: "2024.4.9"},
        { name: "未命名17", subject: '英语',  grade: '初二', exam: '中考', pageNumber: 5, problemNumber: 44, answer: '有', time: "2024.4.7"},
        { name: "未命名18", subject: '数学',  grade: '高一', exam: '高考', pageNumber: 2, problemNumber: 12, answer: '有', time: "2024.4.5"},
        { name: "未命名19", subject: '语文',  grade: '初二', exam: '中考', pageNumber: 3, problemNumber: 29, answer: '有', time: "2024.4.2"},
        { name: "未命名44", subject: '英语',  grade: '初二', exam: '中考', pageNumber: 5, problemNumber: 44, answer: '无', time: "2024.4.1"},
        { name: "未命名43", subject: '数学',  grade: '高二', exam: '高考', pageNumber: 2, problemNumber: 10, answer: '无', time: "2024.4.1"},
      ],
    }
  },
  methods:{
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
    }
  },
  computed:{
    displayData(){
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

      if(this.search){
        let searchData=[]
        for(let i=0;i<data.length;i++)
          for(let key in data[i]){
            let it
            if(typeof data[i][key] === "number")
              it=String(data[i][key])
            else
              it=data[i][key]

            if(it.includes(this.search)){
              searchData.push(data[i])
              break
            }
          }
            
        data=searchData
      }

      return data.slice((this.state.pageNum-1)*this.state.pageSize , this.state.pageNum*this.state.pageSize)
    }
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

</style>