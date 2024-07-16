<template>

  <!-- 展示的信息在displayData、所有的信息在historyData。主要区别在于是否经过搜索 -->
  <div class="find">
    <div class="select">
      <p>用户列表</p>
      <div class="select-opt" :class="{'active':active===-1}" @click=switchActive2()>震撼-资伍组</div>
      <div class="select-opt" v-for="(opt,index) in options" :key="index" :class="{'active':active===index}" @click="switchActive(index)">
        {{ opt }}
      </div>
    </div>
    <el-dialog :title="isAdd ? '添加用户' : '修改用户'" v-model="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px">
        <el-form-item label="学号" prop="stuId"> <!-- prop是验证规则属性 -->
          <el-input v-model="addUserForm.stuId" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username"> <!-- prop是验证规则属性 -->
          <el-input v-model="addUserForm.username" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addUserForm.phone" @input="change($event)"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit()">确 定</el-button>
        </span>
    </el-dialog>

    <el-col :span="4">
      <el-button type="primary" @click="handleAdd">添加用户</el-button>
    </el-col>
    <div class="search">
      <input type="text" placeholder="搜索" v-model="state.searchValue">
      <img src="../assets/search.png">
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>学号</th>
        <th>用户名</th>
        <th>手机号</th>
        <th>邮箱</th>
        <th>头像</th>
        <th>创建时间</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item,index) in displayData" :key="item.id">
        <td>{{ item.stuId }}</td>
        <td>{{ item.username }}</td>
        <td>{{ item.phone }}</td>
        <td>{{ item.email }}</td>

        <td class="img-td"><img :src="item.imageUrl != null ? item.imageUrl : 'https://dimg04.c-ctrip.com/images/zc0a170000011f8t5F2C8.jpg'" alt="用户头像"></td>
        <td>{{ item.createTime }}</td>
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
          <a href="#" @click="deleteUser(item.id)" style="color: #87CEFA;">
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
      historyData:[         //n组数据
        {id: 1, stuId:123, username: '张璞',  phone:'12345', exam: '高考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer:'震撼', create_time: "2024.5.1"},
        {id: 2, stuId:123, username: '震撼',  phone:'12142', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '无', create_time: "2024.5.1"},
        {id: 3, stuId:123, username: '王琦',  phone:'54321', exam: '高考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '有', create_time: "2024.4.28"},
        {id: 4, stuId:123, username: '刘济华',phone: '12345', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7",email:"123@exam.com", answer: '有', create_time: "2024.4.28"},
        {id: 5, stuId:123, username: '何中延',phone: '54321', exam: '高考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7",email:"123@exam.com", answer: '无', create_time: "2024.4.28"},
        {id: 6, stuId:123, username: '数学',  phone:'12345', exam: '高考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '有', create_time: "2024.4.21"},
        {id: 7, stuId:123, username: '语文',  phone:'初三', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '有', create_time:"2024.4.21"},
        {id: 8, stuId:123, username: '英语',  phone:'初二', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '无', create_time:"2024.4.21"},
        {id: 9, stuId:123, username: '数学',  phone:'高一', exam: '高考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '有', create_time:"2024.4.19"},
        {id: 10,stuId:123,  username:  '语文', phone: '初一', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com",  answer: '有',create_time: "2024.4.19"},
        {id: 11,stuId:123,  username:  '英语', phone: '初二', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '无', create_time: "2024.4.19"},
        {id: 12,stuId:123,  username:  '数学', phone: '高一', exam: '高考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '有', create_time: "2024.4.16"},
        {id: 14,stuId:123,  username:  '英语', phone: '高二', exam: '高考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '有', create_time: "2024.4.10"},
        {id: 13,stuId:123,  username:  '英语', phone: '初二', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '有', create_time: "2024.4.10"},
        {id: 15,stuId:123,  username:  '数学', phone: '初二', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '无', create_time: "2024.4.10"},
        {id: 16,stuId:123,  username:  '语文', phone: '初三', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '有', create_time: "2024.4.10"},
        {id: 17,stuId:123,  username:  '英语', phone: '初二', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '无', create_time: "2024.4.10"},
        {id: 18,stuId:123,  username:  '数学', phone: '初三', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '有', create_time: "2024.4.10"},
        {id: 19,stuId:123,  username:  '语文', phone: '初三', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '无', create_time: "2024.4.9"},
        {id: 20,stuId:123,  username:  '英语', phone: '初二', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '有', create_time: "2024.4.7"},
        {id: 21,stuId:123,  username:  '数学', phone: '高一', exam: '高考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '有', create_time: "2024.4.5"},
        {id: 22,stuId:123,  username:  '语文', phone: '初二', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '有', create_time: "2024.4.2"},
        {id: 23,stuId:123,  username:  '英语', phone: '初二', exam: '中考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '无', create_time: "2024.4.1"},
        {id: 24,stuId:123,  username:  '数学', phone: '高二', exam: '高考', avatarUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.D9SyQRPpqDoTXRX0VRqJdAHaHa?w=206&h=208&c=7&r=0&o=5&dpr=1.4&pid=1.7", email:"123@exam.com", answer: '无', create_time: "2024.4.1"},
      ],
      addDialogVisible: false, //控制添加用户对话框的显示与隐藏
      addUserForm:{},
      addUserFormRules: {
        stuId:[{required:true,message:'请输入学号',trigger:'blur'}],
        username: [{required:true,message:'请输入用户名',trigger:'blur'},
          {min:3,max:10,message:'用户名长度在3~10个字符',trigger:'blur'}],
        password: [{required:true,message:'请输入密码',trigger:'blur'},
          {min:6,max:15,message:'密码长度在6~15个字符',trigger:'blur'}],
        email: [{required:true,message:'请输入邮箱',trigger:'blur'}],
        phone: [{required:true,message:'请输入手机号',trigger:'blur'}],
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
      this.addUserForm = this.displayData[index]
    },
    handleAdd(event){
      this.addDialogVisible = true
      this.isAdd = true
    },
    formatDateArrayToString(dateArray) {
      // 检查传入的数组是否具有6个元素
      if (!dateArray || dateArray.length > 6) {
        ElMessage.error("日期数组必须小于6个元素：年、月、日、小时、分钟")
        throw new Error('日期数组必须小于6个元素：年、月、日、小时、分钟');
      }
      if (dateArray.length < 6) {
        for (let i = dateArray.length; i < 6; i++) {
          dateArray.push(0)
        }
      }
      // 解构数组元素
      const [year, month, day, hour, minute, second] = dateArray;

      // 使用padStart方法确保月、日、小时和分钟是两位数格式
      const formattedMonth = String(month).padStart(2, '0');
      const formattedDay = String(day).padStart(2, '0');
      const formattedHour = String(hour).padStart(2, '0');
      const formattedMinute = String(minute).padStart(2, '0');

      // 组合成最终的日期时间字符串
      return `${year}-${formattedMonth}-${formattedDay} ${formattedHour}:${formattedMinute}`;
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
      this.$refs.addUserFormRef.resetFields();
      this.getUserList()
    },
    handleSubmit(){
      if(this.isAdd)
        this.addUser()
      else this.updateUser()
    },
    async getUserList(){
      try {
        const queryParams = {
          username: "",
          page: 1,
          pageSize: 1000
        }
        const ret = await axios.get(`${constant.host}/user/user/page`, {params: queryParams})
        if(ret.data.code != 1){
          ElMessage.error(ret.data.msg)
        }
        this.historyData = ret.data.data.records//总数
        this.historyData.forEach((item) => {
          item.createTime = this.formatDateArrayToString(item.createTime)
        })
      } catch(error) {
        ElMessage.error(error)
      }
    },
    // 点击按钮，添加新用户
    async addUser(){
      await this.$refs.addUserFormRef.validate(async valid =>{
        if(!valid) return;//校验没通过，返回
        try {
          const headersConfig = {
            headers: {
              'Content-Type': 'application/json', // 根据你的API要求设置正确的Content-Type
              'Token': `${store.user.token}` // 通常Token以Bearer开头
            }
          }
          const ret = await axios.post(`${constant.host}/user/user`, this.addUserForm, headersConfig)
          if(ret.data.code != 1){
            ElMessage.error(ret.data.msg)
          }
          else{
            // 隐藏添加用户的对话框
            ElMessage.success("添加成功")
            this.addDialogVisible = false;
            //重新获取用户列表数据
            this.getUserList();
          }
        } catch(error) {
          ElMessage.error(error)
        }
      })
    },
    async updateUser() {
      await this.$refs.addUserFormRef.validate(async valid =>{
        if(!valid) return;//校验没通过，返回
        try {
          const headersConfig = {
            headers: {
              'Content-Type': 'application/json', // 根据你的API要求设置正确的Content-Type
              'Token': `${store.user.token}` // 通常Token以Bearer开头
            }
          }
          const ret = await axios.put(`${constant.host}/user/user`, this.addUserForm, headersConfig)
          if(ret.data.code != 1){
            ElMessage.error(ret.data.msg)
          }
          else{
            // 隐藏添加用户的对话框
            ElMessage.success("修改成功")
            //如果修改当前登录账号的影响显示的信息，更新登录信息
            if(this.addUserForm.id == store.user.id && (this.addUserForm.username != store.user.username)) {
              store.user.username = this.addUserForm.username
            }
            this.addDialogVisible = false;
            //重新获取用户列表数据
            this.getUserList();
            
          }
        } catch(error) {
          ElMessage.error(error)
        }
      })
    },
    async deleteUser(targetId) {
      try {
        const headersConfig = {
          headers: {
            'Content-Type': 'application/json', // 根据你的API要求设置正确的Content-Type
            'Token': `${store.user.token}` // 通常Token以Bearer开头
          }
        }
        const ret = await axios.delete(`${constant.host}/user/user/${targetId}`, headersConfig)
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
              for(let key in data[i]){
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
    await this.getUserList()
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