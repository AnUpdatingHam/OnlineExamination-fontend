<template>
  <div class="header"> <!-- 这里是header的开始 -->
    <div class="left">
      <span>我的课群</span>
    </div>
    <div class="right">
      <el-button type="primary" @click="goToAddCourse">添加课群</el-button>
    </div>
  </div>
  <div class="team-container">
    <div class="team-grid">
      <!-- 循环显示所有课程 -->
      <router-link v-for="(team, index) in teams" :key="index" class="team-item" :style="{ backgroundImage: 'url(' + team.backgroundImg + ')' }" :to="{path: '/examList', query: {tid: team.id, tname: team.name}}">
        <div class="team-content">
          <div class="team-term">{{ team.term }}</div>
          <div class="team-name">{{ team.name }}</div>
          <div class="team-admins">
            <p>负责人： {{ team.admins }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {constant} from "@/stores/constant";
import {store} from "@/stores/store";
import { ElMessage } from 'element-plus';

export default {
  name: 'TeamListView',

  data() {
    return {
      teams: [
        {
          //id: ???
          term: '2024-2025',
          name: '计算机科学导论',
          admins: '张璞',
          //添加图片为背景
          backgroundImg: constant.backgroundImg[1]
        },
        {
          term: '2024-2025',
          name: '数据结构与算法',
          admins: '震撼',
          backgroundImg: constant.backgroundImg[2]
        },
        {
          term: '2024-2025',
          name: '数据库原理',
          admins: '王琦',
          backgroundImg: constant.backgroundImg[3]
        },
        {
          term: '2024-2025',
          name: '操作系统',
          admins: '李白',
          backgroundImg: constant.backgroundImg[4]
        },
        {
          term: '2024-2025',
          name: '人工智能基础',
          admins: '张无忌',
          backgroundImg: constant.backgroundImg[5]
        },
        // 新添加的课程对象
      ]
    };
  },
  async created() {
    try {
      //填入测试数据
      this.page = 1;
      this.pageSize = 10;
      const queryParams = {
        userId: store.user.id,
        page: this.page,
        pageSize: this.pageSize
      }

      const ret = await axios.get(`${constant.host}/user/team/page`, {params: queryParams})
      this.teams = ret.data.data.records
      for(let i = 0; i < this.teams.length ; i++){
        this.teams[i].backgroundImg = constant.backgroundImg[(i + 8) % 8]
      }
      console.log(JSON.stringify(ret))
      //根据历史作答和试卷渲染页面

    } catch(error) {
      console.error("Getting Data Error:", error)
    }
  },
  methods: {
    gotoExam(index){
      store.team = this.teams[index]
      this.$router.push({name: 'exam'})
    },
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

.team-container {
  margin: 1vh 3vw;
  padding: 20px;
  border: 1px solid #cdcbcb; /* 添加整体的背景框 */
  border-radius: 10px;
  overflow: auto;
}
.team-container::-webkit-scrollbar{
  width: 0px;/*隐藏滚动条*/
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.team-item {
  height: 200px;
  color: white; /* 修改字体颜色为黑色 */
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  position: relative;
  cursor: pointer;
  display: -webkit-box;
  overflow: hidden;
}

.team-content {
  position: relative;
  top:55%;
  background-color: rgba(0,0,0,20%);
  width: 100%;
  height: 45%;
}

.team-term {
  font-size: 13px;
  font-weight: normal;
  position:relative;
  color: #ffffff;
  top:3%;
  left:3%;
}

.team-name {
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left:3%;
}
.team-name:hover{
  text-overflow: inherit;
  overflow: visible;
  white-space: pre-line;
}

.team-admins p {
  font-family: Arial, sans-serif;
  font-size: 14px;
  margin-left: 3%;
}

</style>
