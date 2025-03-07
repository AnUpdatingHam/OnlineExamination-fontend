<template>
  <div class="page">
    <div class="page-wrapper">
      <div class="body">
        <!-- 编辑界面 -->
        <div class="edit-profile" v-if="isEditing && editingField === 'avatar'">
          <div class="edit-content">
            <h3>编辑头像</h3>
            <div class="close-button" @click="toggleEdit('avatar')">X</div>
            <input type="file" accept="image/*" style="display: block" ref="fileInput" @change="handleAvatarChange">
            <el-button @click="saveAvatar" type="primary">保存</el-button>
          </div>
        </div>

        <!-- 编辑手机号界面 -->
        <div class="edit-profile" v-if="isEditing && editingField === 'phone'">
          <div class="edit-content">
            <h3>编辑手机号</h3>
            <div class="close-button" @click="toggleEdit('phone')">X</div>
            <input type="text" v-model="phoneEdit">
            <el-button @click="savePhone" type="primary">保存</el-button>
          </div>
        </div>

        <!-- 编辑邮箱界面 -->
        <div class="edit-profile" v-if="isEditing && editingField === 'email'">
          <div class="edit-content">
            <h3>编辑邮箱</h3>
            <div class="close-button" @click="toggleEdit('email')">X</div>
            <input type="text" v-model="emailEdit">
            <el-button @click="saveEmail" type="primary">保存</el-button>
          </div>
        </div>

        <!-- 显示界面 -->
        <div class="user-profile">
          <div class="container">
            <h2 class="title">用户个人中心</h2>
            <div class="profile-card">
              <div class="avatar" @click="toggleEdit('avatar')">
                <img :src="store.user.imageUrl" alt="用户头像" class="avatar-img">
                <span v-if="!isEditing">点击编辑</span>
              </div>
              <div class="info">
                <h3 class="name">{{ store.user.username }}</h3>
                <p>学号: {{ store.user.stuId }}</p>
                <p class="editable" @click="toggleEdit('phone')">手机号: {{ store.user.phone }} <span class="edit-button">编辑</span></p>
                <p class="editable" @click="toggleEdit('email')">邮箱: {{ store.user.email }} <span class="edit-button">编辑</span></p>
                <p>创建时间: {{ formatDateArrayToString(store.user.createTime) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { ElButton, ElMessage, ElLoading } from 'element-plus';
import axios from 'axios';
import {store} from "../stores/store";
import {constant} from "@/stores/constant";

export default {
  name: 'UserProfile',
  computed: {
    store() {
      return store
    }
  },
  components: {
    ElButton,
  },
  data() {
    return {
      isEditing: false,
      editingField: '',
      stuId: '',
      username: '',
      createTime: '',
      avatarFile: null,
      phoneEdit: '',
      emailEdit: '',
      loading: null,
    };
  },
  created() {
  },
  methods: {
    toggleEdit(field) {
      this.isEditing = !this.isEditing;
      this.editingField = field;
      if (field === 'phone') {
        this.phoneEdit = store.user.phone;
      } else if (field === 'email') {
        this.emailEdit = store.user.email;
      }
    },
    async saveAvatar() {
      this.showLoading('正在保存头像...');
      try {
        let formData = new FormData();
        formData.append('avatar', this.avatarFile);

        const response = await axios.post('/api/user/update/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200 && response.data) {
          console.log('头像保存成功', response.data);
          store.user.imageUrl = response.data.imageUrl;//改到store.user
          this.isEditing = false;
          this.showMessage('头像保存成功', 'success');
        } else {
          this.showMessage('保存头像失败', 'error');
        }
      } catch (error) {
        console.error('保存头像失败', error);
        this.showMessage('保存头像失败', 'error');
      } finally {
        this.closeLoading();
      }
    },
    handleAvatarChange(event) {
      this.avatarFile = event.target.files[0];
    },
    async savePhone() {
      this.showLoading('正在保存手机号...');
      const headersConfig = {
        headers: {
          'Content-Type': 'application/json', // 根据你的API要求设置正确的Content-Type
          'Token': `${store.user.token}` // 通常Token以Bearer开头
        }
      }
      let putData = {
        id: store.user.id,
        phone: this.phoneEdit
      }
      try {
        const response = await axios.put(`${constant.host}/user/user`, putData, headersConfig);

        if (response.status === 200 && response.data) {
          console.log('手机号保存成功', response.data);
          store.user.phone = this.phoneEdit;//改到store.user
          this.isEditing = false;
          this.editingField = '';
          this.showMessage('手机号保存成功', 'success');
        } else {
          this.showMessage('保存手机号失败', 'error');
        }
      } catch (error) {
        console.error('保存手机号失败', error);
        this.showMessage('保存手机号失败', 'error');
      } finally {
        this.closeLoading();
      }
    },
    async saveEmail() {
      this.showLoading('正在保存邮箱...');
      const headersConfig = {
        headers: {
          'Content-Type': 'application/json', // 根据你的API要求设置正确的Content-Type
          'Token': `${store.user.token}` // 通常Token以Bearer开头
        }
      }
      let putData = {
        id: store.user.id,
        email: this.emailEdit
      }
      try {
        const response = await axios.put(`${constant.host}/user/user`, putData, headersConfig);
        if (response.status === 200 && response.data) {
          console.log('邮箱保存成功', response.data);
          store.user.email = this.emailEdit;//改到store.user
          this.isEditing = false;
          this.editingField = '';
          this.showMessage('邮箱保存成功', 'success');
        } else {
          this.showMessage('保存邮箱失败', 'error');
        }
      } catch (error) {
        console.error('保存邮箱失败', error);
        this.showMessage('保存邮箱失败', 'error');
      } finally {
        this.closeLoading();
      }
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
    showLoading(text) {
      this.loading = ElLoading.service({ text });
    },
    closeLoading() {
      if (this.loading) this.loading.close();
    },
    showMessage(message, type) {
      ElMessage({ message, type });
    }
  }
};
</script>

<style scoped>

.profile p {
  margin-right: 20px;
}

.page {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-wrapper {
  width: 80%;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
}

.body {
  width: 90%;
  margin: auto;
  text-align: center; /* 调整文本居中 */
}

.user-profile {
  width: 90%;
  margin-top: 20px;
}

.container {
  width: 90%;
  max-width: 600px;
  margin: auto;
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
  width: 100%;
  background-color: #f4f4f4;
}

.container {
  width: 90%;
  max-width: 600px;
  margin: auto;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.profile-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  justify-content: center; /* 调整为居中对齐 */
  align-items: center; /* 调整为居中对齐 */
  margin: auto; /* 居中对齐 */
  padding: 20px; /* 添加内边距 */
}

.avatar {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 35px; /* 水平间距 */
  cursor: pointer;
}

.avatar-img {
  width: 100%;
  height: auto;
  border-radius: 50%;
}

.avatar span {
  position: absolute;
  bottom: 0;
  left: 60%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 4px;
  border-radius: 6px;
  font-size: 10px;
  color: #333;
  display: none;
}

.avatar:hover span {
  display: block;
}

.info {
  padding: 0 20px; /* 水平内边距 */
  text-align: left;
  flex-grow: 1;
  margin-left: 40px; /* 右移 */
}

.info h3.name {
  margin: 0 0 10px;
  color: #333;
}

.info p {
  margin: 5px 0;
  color: #666;
}

.editable {
  position: relative;
  cursor: pointer;
}

.edit-button {
  display: none;
  color: #0bb4b0;
  cursor: pointer;
}

.editable:hover .edit-button {
  display: inline;
}

.edit-profile input[type="text"] {
  width: calc(100% - 20px);
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

@media (max-width: 900px) {
  .profile-card {
    flex-direction: column;
    align-items: center;
  }

  .avatar {
    margin-bottom: 20px;
  }

  .info {
    padding: 25px;
    text-align: center; /* 调整文本居中 */
  }
}
</style>