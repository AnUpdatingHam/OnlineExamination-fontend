<script setup>
import { ref } from 'vue'
import {store} from "@/stores/store";

const settings = defineProps({
  collapse: Boolean,
  width: String
})

const iconColor = ref('color:#F8FAFB')
</script>


<template>
  <el-aside :width="settings.width">
    <el-scrollbar>
      <el-menu :default-openeds="['1', '3']" 
      :collapse="settings.collapse" active-text-color="#F8FAFB"
        background-color="#1A1C1E" text-color="#74767A" router="true">
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <House />
            </el-icon><span>首页</span>
          </template>
          <el-menu-item index="/">首页</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <Menu />
            </el-icon><span>我的课群</span>
          </template>
          <el-menu-item :index="`/${store.isAdmin ? 'admin' : 'user'}/team`">我的课群</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon>
              <Message />
            </el-icon><span>问题列表</span>
          </template>
          <el-menu-item :index="`/${store.isAdmin ? 'admin' : 'user'}/question`">问题列表</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>
            <el-icon>
              <Files />
            </el-icon><span>考试列表</span>
          </template>
          <el-menu-item :index="`/${store.isAdmin ? 'admin' : 'user'}/exam`">考试管理列表</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="5">
          <template #title>
            <el-icon>
              <User />
            </el-icon><span>用户管理</span>
          </template>
          <el-menu-item :index="`/${store.isAdmin ? 'admin' : 'user'}/user`">用户管理列表</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="6">
          <template #title>
            <el-icon>
              <Watermelon />
            </el-icon><span>个人中心</span>
          </template>
          <el-menu-item :index="`/${store.isAdmin ? 'admin/team' : 'user'}`">用户主页</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="7">
          <template #title>
            <el-icon>
              <Edit />
            </el-icon><span>编辑器</span>
          </template>
          <el-menu-item index="/admin/md">markdown</el-menu-item>
          <el-menu-item index="/admin/richText">富文本</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="8">
          <template #title>
            <el-icon>
              <setting />
            </el-icon><span>系统设置</span>
          </template>
          <el-menu-item index="/admin/light">背景色</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>


<style scoped>
.el-aside {
  height: 100vh;
  overflow: hidden;
  box-shadow: var(--el-box-shadow-lighter);
}

.el-scrollbar {
  height: 100vh;
  overflow: hidden;
  background-color: #1A1C1E;
}

.el-menu {

  border-right: none;
}</style>