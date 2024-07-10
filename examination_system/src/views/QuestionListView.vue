<template>
  <div class="question-list">
    <div class="paper-header">
      <h2>试卷名称</h2>
      <p>考试日期：2024年7月1日</p>
      <p>考试时间：120分钟</p>
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

export default {
  data() {
    return {
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
          text: '这里是问题的具体内容。这是一个示例文本，它将展示自动换行的效果。这是一个示例文本，它将展示自动换行的效果。Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n这里是问题的具体内容。这是一个示例文本，它将展示自动换行的效果。这是一个示例文本，它将展示自动换行的效果。Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n这里是问题的具体内容。这是一个示例文本，它将展示自动换行的效果。这是一个示例文本，它将展示自动换行的效果。Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n',
          candidateAns: "选项A 选项B 选项C 选项D",
          options: ['选项A', '选项B', '选项C', '选项D'],
          score: 5,
          correctAnswer: 0,
          analysis: '这里是解析的内容，可以根据实际需要填写。',
          ans: 1
        },
        {
          id: 2,
          text: '这是第二个问题。',
          candidateAns: "选项A 选项B 选项C 选项D",
          options: ['选项A', '选项B', '选项C', '选项D'],
          score: 10,
          correctAnswer: 1,
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
        console.log("ans = " + putData.ans)
        const ret = await axios.put(`${constant.host}/user/record`, putData)
      } catch(error) {
        console.error("Puting Data Error:", error)
      }
    }
  },

  async created() {
    try {
      //填入测试数据
      this.userId = 2;
      this.examId = 1;
      this.page = 1;
      this.pageSize = 10;
      //请求历史作答记录
      const queryParams = {
        userId: this.userId,//需要修改
        examId: this.examId,//需要修改
        page: this.page,//需要修改
        pageSize: this.pageSize//需要修改
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
  border-block:1px solid #000000;
  width: 85vw;
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
