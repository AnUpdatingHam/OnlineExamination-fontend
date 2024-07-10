<template>
  <div class="header"> <!-- 这里是header的开始 -->
    <div class="left">
      <span>我的课群</span>
    </div>
    <div class="right">
      <el-button type="primary" @click="goToAddCourse">添加课群</el-button>
    </div>
  </div>
  <div class="course-container">
    <div class="course-grid">
      <!-- 循环显示所有课程 -->
      <div v-for="(course, index) in courses" :key="index" class="course-item" :style="{ backgroundImage: 'url(' + course.backgroundImg + ')' }">
        <div class="course-content">
          <div class="course-year">{{ course.year }}</div>
          <div class="course-name">{{ course.name }}</div>
          <div class="course-details">
            <p>{{ course.details }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseManager',

  data() {
    return {
      courses: [
        {
          year: '2024-2025',
          name: '计算机科学导论',
          details: '负责人：张璞',
          //添加图片为背景
          backgroundImg: './src/assets/8.jpg'
        },
        {
          year: '2024-2025',
          name: '数据结构与算法',
          details: '负责人：震撼',
          backgroundImg: './src/assets/4.jpg'
        },
        {
          year: '2024-2025',
          name: '数据库原理',
          details: '负责人：王琦',
          backgroundImg: './src/assets/5.jpg'
        },
        {
          year: '2024-2025',
          name: '操作系统',
          details: '负责人：李白',
          backgroundImg: './src/assets/6.jpg'
        },
        {
          year: '2024-2025',
          name: '人工智能基础',
          details: '负责人：张无忌',
          backgroundImg: './src/assets/7.jpg'
        },
        // 新添加的课程对象
      ]
    };
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between; /* 让左右两侧分别对齐 */
  align-items: center; /* 垂直居中 */
  background-color: #ffffff;
  padding: 10px 20px;
  color: white;
}

.rectangle {
  display: inline-block;
  padding: 8px 16px;
  border: 2px solid #FFFFFF; /* 白色边框 */
  border-radius: 10px; /* 圆角 */
}

.header .left {
  font-weight: bold;
  color: black;
  font-size: 20px;
}

.header .right {
  text-align: right;
}

.course-container {
  padding: 20px;
  border: 1px solid #ccc; /* 添加整体的背景框 */
  border-radius: 10px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.course-item {
  height: 200px;
  color: black; /* 修改字体颜色为黑色 */
  border-radius: 10px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  position: relative;
  cursor: pointer;
}

.course-content {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
}

.course-year {
  font-size: 14px;
  font-weight: bold;
}

.course-name {
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;
}

.course-details p {
  font-size: 14px;
  margin-top: 5px;
}
</style>
