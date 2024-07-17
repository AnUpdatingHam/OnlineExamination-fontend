<template>
  <div class="question-list">
    <div class="paper-header">
      <h2>{{team.name}}</h2>
      <h2>{{exam.name}}</h2>
      <p>开始时间: {{exam.beginTime}}</p>
      <p>结束时间: {{exam.endTime}}</p>
    </div>
    <div class="question-list-container">
      <div v-for="(question, index) in questions" :key="question.id" class="question-item">
        <div class="question-header">
          <span class="question-number">问题 {{ index + 1 }}</span>
          <span class="question-score">（{{ question.score }} 分）</span>
        </div>
        <div class="question-body">
          <p>{{ question.text }}</p>
          <ul class="options-list">
            <li v-for="(option, optionIndex) in question.options" :key="optionIndex">
<!--              <div class="Radio">-->
                <input type="radio" :id="`option-${index}-${optionIndex}`" :name="`question-${index}`" v-model="questions[index].ans" :disabled="submitted" :value="optionIndex" @change="recordAnsChange(index)">
                <label :for="`option-${index}-${optionIndex}`">{{ option }}</label>
<!--              </div>-->
            </li>
          </ul>
          <!-- Show correct answer and analysis after submission -->
          <div v-if="submitted" class="answer-analysis">
            <p style="color: red;">正确答案：{{ question.options[question.correctAnswer] }}</p>
            <p class="analysis">解析：{{ question.analysis }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!submitted" class="paper-footer">
      <button class="submit-button" @click="submitPaper">交 卷</button>
    </div>
    <div v-if="submitted" class="result-container">
      <h3 style="color: #e83232">你的成绩：{{ totalScore }} 分</h3>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {constant} from "@/stores/constant";
import {store} from "@/stores/store";
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      team: store.team,
      exam: store.exam,
      records: [
      {
        "questionId": 0,
        "ans": "string",
        "text": "string",
        "imageUrls": "string",
        "type": 0,
        "candidateAns": "string",
        "candidateAnsUrls": "string",
        "recordId": 0,
        "orderNumber": 0
      },
      {
        "questionId": 1,
        "ans": "string",
        "text": "string",
        "imageUrls": "string",
        "type": 1,
        "candidateAns": "string",
        "candidateAnsUrls": "string",
        "recordId": 1,
        "orderNumber": 1
      }
    ], //历史作答记录
      questions: [
        {
          id: 1,
          text: '请问资伍组的组长是谁？\n',
          candidateAns: "选项A 选项B 选项C 选项D",
          options: ['张璞', '震撼', '郑汉', '汉灯'],
          score: 5,
          correctAnswer: 1,
          analysis: '这里是解析的内容，可以根据实际需要填写。',
          ans: 1
        },
        {
          id: 2,
          text: '请问张璞帅还是郑汉帅？',
          candidateAns: "选项A 选项B 选项C 选项D",
          options: ['张璞', '郑汉', '震撼', '钝角'],
          score: 95,
          correctAnswer: 0,
          analysis: '这里是第二个问题的解析内容。',
          ans: 2
        },
        // Add more questions as needed
      ],
      submitted: false
    };
  },
  computed: {
    totalScore() {
      let score = 0;
      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].ans === this.questions[i].correctAnswer) {
          score += this.questions[i].score;
        }
      }
      return score;
    }
  },
  methods: {
    submitPaper() {
      this.submitted = true;
    },
    async recordAnsChange(questionIndex) {
      try {
        const putData = {
          id: this.records[questionIndex].recordId,//需要请求获得records
          ans: this.questions[questionIndex].ans
        }
        const headersConfig = {
          headers: {
            'Content-Type': 'application/json', // 根据你的API要求设置正确的Content-Type
                'Token': `${store.user.token}` // 通常Token以Bearer开头
          }
        }
        const ret = await axios.put(`${constant.host}/user/record`, putData, headersConfig)
        if(ret.data.code != 1){
          ElMessage.error(ret.data.msg)
        }
      } catch(error) {
        ElMessage.error(error)
      }
    }
  },

  async created() {
    try {
      //填入测试数据
      this.page = 1;
      this.pageSize = 10;
      //请求历史作答记录
      const queryParams = {
        userId: store.user.id,
        examId: this.$route.query.qid,
        page: this.page,
        pageSize: this.pageSize
      }

      const ret = await axios.get(`${constant.host}/user/exam/records/page`, {params: queryParams})
      console.log(JSON.stringify(ret))
      this.records = ret.data.data.records
      this.questions = this.records
      for (let i = 0; i < this.questions.length; i++) {
        this.questions[i].options = this.records[i].candidateAns.split(' ')
      }
      //根据历史作答和试卷渲染页面

    } catch(error) {
      console.error("Getting Data Error:", error)
    }
  }
};
</script>

<style scoped>
.question-list {
  max-width: 1200px;
  min-width:100px;
  margin: auto;
  font-family: Arial, sans-serif;
  background-color: #ffffff;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(106, 105, 105, 0.1);
  border: solid;
  overflow: auto;
}
.question-list::-webkit-scrollbar{
  width: 0px;/*隐藏滚动条*/
}

.question-list-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 60vw;
  height: fit-content;
  word-wrap: break-word;
}

.paper-header {
  text-align: center;
  margin-bottom: 5px;
}

.question-item {
  margin-bottom: 15px;
  border: 1px solid #0bb4b0;
  padding: 15px;
  border-radius: 8px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.question-number {
  font-weight: bold;
}

.question-score {
  color: #0bb4b0;
}

.options-list {
  list-style-type: none;
  padding: 5px;
}

.options-list li {
  margin-bottom: 5px;
}

.submit-button {
  background-color: #0bb4b0;
  color: #fff;
  border: solid;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 7px;
  cursor: pointer;
  float:right;
  margin-bottom: 20px;
  margin-right: 15px;
}

.submit-button:hover {
  background-color: #046a66;
}

.result-container {
  margin-top: 20px;
  text-align: center;
}

.answer-analysis {
  margin-top: 15px;
}

.analysis {
  color: #e83232;
  font-weight: bold;
}
</style>
