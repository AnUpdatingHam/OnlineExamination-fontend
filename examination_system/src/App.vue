<script setup>
import { RouterView } from 'vue-router';
import HomeView from "@/views/HomeView.vue";
//import QuestionListView from './views/QuestionListView.vue';
</script>

<template>
  <div>
    <!-- 可以包裹在一个 RouterView 中或者直接使用 -->
    <HomeView></HomeView>
    <!-- <RouterView></RouterView> -->
<!--    <QuestionListView></QuestionListView>-->
  </div>
</template>

<style scoped>
/* 可选的样式 */
</style>
