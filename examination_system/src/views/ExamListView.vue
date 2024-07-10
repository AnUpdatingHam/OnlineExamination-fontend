<template>
  <div class="header"> <!-- 这里是header的开始 -->
    <div class="left">
      <span>"{{team.name}}"的考试</span>
    </div>
    <div class="right">
      <el-button type="primary" @click="goToAddCourse">添加课群</el-button>
    </div>
  </div>
  <div class="team-container">
    <div class="team-grid">
      <!-- 循环显示所有考试 -->
      <div v-for="(exam, index) in exams" :key="index" class="team-item" :style="{ backgroundImage: 'url(' + exam.backgroundImg + ')' }"
      @click="gotoQuestion(index)">
        <div class="team-content">
          <div class="team-name">{{ exam.name }}</div>
          <div class="team-term">开始时间: {{ exam.beginTime }}</div>
          <div class="team-term">结束时间: {{ exam.endTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {constant} from "@/stores/constant";
import {store} from "@/stores/store";

export default {
  name: 'ExamListView',

  data() {
    return {
      team: store.team,
      exams: [
        {
          id: 1,
          name: '期中考试',
          beginTime: [2024, 12, 10, 9, 0],
          endTime:[2024, 12, 10, 11, 0],
          //添加图片为背景
          backgroundImg: constant.backgroundImg[1]
        },
        {
          id: 2,
          name: '期末考试',
          beginTime: [2024, 12, 12, 9, 0],
          endTime: [2024, 12, 12, 11, 0],
          //添加图片为背景
          backgroundImg: constant.backgroundImg[2]
        }
      ]
    };
  },
  async created() {
    try {
      //填入测试数据
      this.page = 1
      this.pageSize = 10
      this.team = store.team
      //请求历史作答记录
      const queryParams = {
        userId: store.user.id,
        teamId: store.team.id,
        page: this.page,//需要修改
        pageSize: this.pageSize//需要修改
      }

      const ret = await axios.get(`${constant.host}/user/exam/page`, {params: queryParams})
      this.exams = ret.data.data.records
      for(let i = 0; i < this.exams.length ; i++){
        this.exams[i].backgroundImg = constant.backgroundImg[(i + 14) % 8]
        this.exams[i].beginTime = this.formatDateArrayToString(this.exams[i].beginTime)
        this.exams[i].endTime = this.formatDateArrayToString(this.exams[i].endTime)
      }
      console.log(JSON.stringify(ret))
      //根据历史作答和试卷渲染页面

    } catch(error) {
      console.error("Getting Data Error:", error)
    }
  },
  methods: {
    gotoQuestion(index){
      store.exam = this.exams[index]
      this.$router.push({name: 'question'})
    },
    formatDateArrayToString(dateArray) {
      // 检查传入的数组是否具有6个元素
      if (!dateArray || dateArray.length > 6) {
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
  color:  #FFFFFF;
  margin-left: 3%;
}

.team-name {
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 3%;
}
.team-name:hover{
  text-overflow: inherit;
  overflow: visible;
  white-space: pre-line;
}


</style>

