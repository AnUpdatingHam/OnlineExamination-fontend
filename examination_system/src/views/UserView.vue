<template>
  <div class="page">
    <div class="page-wrapper">
      <div class="header">
        <div class="profile">
          <p>头像:</p>
          <img src="https://img2.baidu.com/it/u=749617030,3039814544&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400" alt="这是一张图片" height="100" width="100">
        </div>
        <div>
          <el-button @click="toggleEdit" type="primary">更改头像</el-button>
        </div>
        <div>
          <p>支持jpg、png、jpeg格式，尺寸120*120，最大1MB</p>
        </div>
      </div>

      <div class="body">
        <!-- 编辑界面 -->
        <div class="edit-profile" v-if="isEditing">
          <div class="edit-content">
            <h3>编辑个人资料</h3>
            <div class="close-button" @click="toggleEdit">X</div>
            <!-- 这里可以添加更多的表单输入元素 -->
            <el-input v-model="username" placeholder="请输入用户名"></el-input>
            <el-input v-model="phone" placeholder="请输入手机号"></el-input>
            <!-- 其他输入项... -->
            <el-button @click="saveProfile" type="primary">保存</el-button>
          </div>
        </div>
        <div class="user-profile">
          <div class="container">
            <h2 class="title">用户个人中心</h2>
            <div class="profile-card">
              <div class="avatar">
                <img :src="imageUrl" alt="用户头像" class="avatar-img">
              </div>
              <div class="info">
                <h3 class="name">{{ username }}</h3>
                <p>学号: {{ stuId }}</p>
                <p>手机号: {{ phone }}</p>
                <p>邮箱: {{ email }}</p>
                <p>创建时间: {{ formatDateTime(createTime) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import {ElButton, ElInput} from 'element-plus';

export default {
  name: 'UserProfile',
  components: {
    ElButton,
    ElInput
  },
  data() {
    return {
      // 假设的用户数据
      isEditing: false, // 控制编辑界面显示隐藏
      stuId: '20230101',
      username: '张三',
      phone: '13800138000',
      email: 'zhangsan@example.com',
      imageUrl: '/path/to/avatar.jpg',
      createTime: '2023-07-14T10:00:00', // 示例时间
    };
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    saveProfile() {
      // 这里可以添加保存用户资料的逻辑
      console.log('保存用户资料', this.username, this.phone);
      this.isEditing = false; // 保存后关闭编辑界面
    },
    formatDateTime(dateTime) {
      const date = new Date(dateTime);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
  }
};
</script>

<style scoped>
.header{
  width: 100%;
  height: 30%;
  background-color: #0bb4b0;
  padding-bottom: 100px;
}

.profile{
  display: flex;
  align-items: center;
}

.profile p{
  margin-right: 20px;
}

.page{
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-wrapper{
  width: 80%;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
}

.body {
  display: flex;
  width: 80%;
  height: 95%;
  align-items: center;
  justify-content: center;
}

.edit-profile {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 1000;
}

.edit-content {
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.user-profile {
  display: block;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 80%;
  height: 80%;
  background-color: #f4f4f4;
}

.container {
  width: 90%;
  max-width: 600px;
  margin: auto;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.profile-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.avatar {
  width: 120px;
  height: 120px;
  margin: 20px;
}

.avatar-img {
  width: 100%;
  height: auto;
  border-radius: 50%;
}

.info {
  padding: 20px;
}

.info h3.name {
  margin: 0 0 10px;
  color: #333;
}

.info p {
  margin: 5px 0;
  color: #666;
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    align-items: center;
  }

  .avatar {
    margin-bottom: 20px;
  }
}
</style>