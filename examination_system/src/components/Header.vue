<script setup>
import { ref, watch} from 'vue';

import { ElMessage } from 'element-plus';

import { useRouter } from 'vue-router';

import { store } from '../stores/store.js';

import axios from 'axios';

import a11Img from '@/assets/a11.jpeg'
import {constant} from "@/stores/constant";

const isCollapse = ref(true)
// 获取父组件传递过来的数据
const showIcon = defineProps({
  isCollapse: Boolean
})

// 获取父组件自定义的事件
const emit = defineEmits(['changeAside'])

// 自定义按钮点击事件，侧边栏的收缩按钮
const collapseAside = () => {
  emit('changeAside')
}

//清除用户信息cookies
const removeCookies = () => {
  const userObjKeys = Object.keys(store.user)
  for(let i = 0; i < userObjKeys.length; ++i) {
    $cookies.remove(userObjKeys[i])
  }
}

//保存用户信息到cookie
const setCookies = () => {
  const userObjKeys = Object.keys(store.user)
  for(let i = 0; i < userObjKeys.length; ++i) {
    $cookies.set(userObjKeys[i], store.user[userObjKeys[i]])
  }
}
//监听登录信息，修改cookies
watch(() => store.user, () => {
  setCookies()
}, {deep: true})

// 登出按钮
const LogOut = ()=>{
  store.login=false
  store.token=''
  removeCookies()
}

const loginAppear=ref(false)

const username=ref('')
const password=ref('')

const bodyParams = ()=>{
  return {
    password: password.value,
    username: username.value
  }
}

const router = useRouter()
const goToPaper = ()=>{
  router.push({name: 'home'})
}

const login = ()=>{
  sendLoginRequest()
}

// // 定义一个异步函数来发送 POST 请求，更改对应id的用户信息
async function sendLoginRequest() {
  try {
    // 使用 Axios 发送 POST 请求，并包含 JSON 数据
    const responseLogin = await axios.post(`${constant.host}/user/user/login`,
        bodyParams(),
        {
          // 设置请求头，指明内容类型为 JSON
          headers: {
            'Content-Type': 'application/json'
          }
        });
    if(responseLogin.data.code===1){
      ElMessage.success("登陆成功")

      store.login=true
      
      const responseInfo = await axios.get(`${constant.host}/user/user/${responseLogin.data.data.id}`);
      store.user = responseInfo.data.data
      loginAppear.value=false
      console.log(store.user) //TODO: 打印日志，测试完毕可以删去
    }
    else{
      ElMessage.error(response.data.msg)
    }


  } catch (error) {
    // 请求失败，捕获并处理错误
    console.error('Error update user:', error);
  }
}

</script>


<template>
  <div>
    <el-header style="display: flex;font-size: 16px;">
      <div style="display: inline-flex;flex: 1; align-items: center;justify-content: left;">
        <el-icon v-show="!showIcon.isCollapse" @click="collapseAside" style="color: #303133;">
          <Fold />
        </el-icon>
        <el-icon v-show="showIcon.isCollapse" @click="collapseAside" style="color: #303133;">
          <Expand />
        </el-icon>
      </div>

      <!-- 已登录状态 -->
      <div class="toolbar" v-if="store.login">
        <div class="block" style="margin-right: 10px;">
          <el-avatar :size="40" :src="store.user.imageUrl != null ? store.user.imageUrl : 'https://dimg04.c-ctrip.com/images/zc0a170000011f8t5F2C8.jpg'" />
        </div>
        <span>{{ store.user.username }}</span>
        <el-dropdown trigger="click">
          <el-icon style="margin-left: 18px; margin-top: 1px;color: #303133;">
            <setting />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>View</el-dropdown-item>
              <el-dropdown-item>Add</el-dropdown-item>
              <el-dropdown-item @click="LogOut();goToPaper()">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 未登录状态 -->
      <div class="header-login-button" v-if="!store.login">
        <button @click="loginAppear=true;goToPaper()">登录</button>
      </div>

    </el-header>
  </div>

  <!-- 登录界面 -->
  <div class="login-back" v-if="loginAppear">
    <div class="login-content">
      <h3>登录</h3>
      <div class="close-button" @click="loginAppear=false">X</div>
      <input v-model="username" class="username" type="text" placeholder="请输入账号" @keyup.enter="login">
      <input v-model="password" class="password" type="password" placeholder="请输入密码" @keyup.enter="login">
      <el-button @click="login" type="primary" round style="border-radius: 40px;width: 200px;height: 40px;background-color: #0608E3;font-size: 18px;font-weight: 400;margin-top:50px;">登录</el-button>
    </div>
  </div>


</template>



<style>
.el-header {
  width: 100%;
  background-color: #fff;
  color: var(--el-text-color-primary);
  box-shadow: var(--el-box-shadow);
}

.toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
  text-align: right;
}

.el-dropdown-menu__item {
  width: 120px;
}

.icon-color {
  color: white;
}

.header-login-button button{
  background-color: #409EFF;
  color: white;
  font-size:16px;
  padding: 10px;
  padding-left: 30px;
  padding-right: 30px;
  margin:10px;
  margin-right: 30px;
  border:none;
  border-radius: 30px;
}

.header-login-button button:hover {
  background-color: #1D91E8;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
}

.header-login-button button:focus{
  outline:none;
}

.login-back {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000; /* 一个较高的z-index值 */
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-content {
  background: #fff;
  width: 600px;
  height: 400px;
  padding: 20px;
  border-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-content h3{
  position: absolute;
  top:60px;
  height: 60px;
  font-size:22px;
  font-weight:1000;
  /* left:15px; */
}

.close-button {
  position: absolute;
  font-size: 20px;
  top: 15px; /* 距离顶部 10px */
  right: 15px; /* 距离右侧 10px */
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-button:hover {
  background-color: red;
  color:white;
  transition: 0.3s;
}

.login-content h3{
  width: 450px;
  font-size: 30px;
  margin-left: 20px;
}

.login-content input{
  width: 400px;
  height: 40px;
  border-radius: 40px;
  font-size: 18px;
  padding:10px;
  padding-left:20px;
}

.username{
  margin-top: 100px;
  margin-bottom: 20px;
}



</style>