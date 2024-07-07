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
          <p>{{ question.content }}</p>
          <ul class="options-list">
            <li v-for="(option, optionIndex) in question.options" :key="optionIndex">
              <input type="radio" :id="`option-${index}-${optionIndex}`" :name="`question-${index}`" v-model="selectedAnswers[index]" :disabled="submitted">
              <label :for="`option-${index}-${optionIndex}`">{{ option }}</label>
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
      <button class="submit-button" @click="submitPaper">交卷</button>
    </div>
    <div v-if="submitted" class="result-container">
      <h3>你的成绩：{{ totalScore }} 分</h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [
        {
          id: 1,
          content: '这里是问题的具体内容。',
          options: ['选项1', '选项2', '选项3', '选项4'],
          score: 5,
          correctAnswer: 0,
          analysis: '这里是解析的内容，可以根据实际需要填写。'
        },
        {
          id: 2,
          content: '这是第二个问题。',
          options: ['选项A', '选项B', '选项C', '选项D'],
          score: 10,
          correctAnswer: 1,
          analysis: '这里是第二个问题的解析内容。'
        },
        // Add more questions as needed
      ],
      selectedAnswers: [],
      submitted: false
    };
  },
  computed: {
    totalScore() {
      let score = 0;
      for (let i = 0; i < this.questions.length; i++) {
        if (this.selectedAnswers[i] === this.questions[i].correctAnswer) {
          score += this.questions[i].score;
        }
      }
      return score;
    }
  },
  methods: {
    submitPaper() {
      this.submitted = true;
    }
  }
};
</script>

<style scoped>
.question-list {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.paper-header {
  text-align: center;
  margin-bottom: 20px;
}

.question-list-container {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
}

.question-item {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.question-number {
  font-weight: bold;
}

.question-score {
  color: #666;
}

.options-list {
  list-style-type: none;
  padding: 0;
}

.options-list li {
  margin-bottom: 10px;
}

.submit-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}

.result-container {
  margin-top: 20px;
  text-align: center;
}

.answer-analysis {
  margin-top: 15px;
}

.analysis {
  color: black;
  font-weight: bold;
}
</style>
