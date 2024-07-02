<template>
  <div class="container">
    <div class="parameters">
      <!-- 参数调节区域，根据需要添加表单元素 -->
      <form @submit.prevent="submitParameters">

        <!-- 选项 -->
        <div class="select">
          <div class="select-item" v-for="(item,index) in items" :key="index">
            <div class="select-row">
              <p>{{ item.name }}</p>
              <div class="select-opt" v-for="(opt,index2) in item.opts" :key="index2" :class="{'active':actives[index]===index2}" @click="switchActive(index,index2)">
                {{ opt }}
              </div>
            </div>
          </div>
        </div>

        <!-- 自定义参数 -->
        <div class="defines">
          <div class="define">
            <label for="pageNumber">页数:</label>
            <input type="text" id="pageNumber" v-model="pageNumber">
          </div>
          <div class="define">
            <label for="problemNumber">题数:</label>
            <input type="text" id="problemNumber" v-model="problemNumber">
          </div>
        </div>
        <div class="answer-attach">
          <label for="answer">是否附带参考答案：</label>
          <input type="checkbox" id="answer" v-model="answer">
        </div>
        <div class="addtion">
          <label for="addtion">自定义补充词条:</label>
          <input type="text" id="addtion" v-model="addtion">
        </div>

        <!-- 命名 -->
        <div class="name">
          <label for="name">给试卷命名</label>
          <input type="text" id="name" v-model="name">
        </div>

        <!-- 词条预览 -->
        <div class="entry-preview">
          词条预览
          <textarea type="text" disabled v-model="entryPreview"></textarea>
        </div>

        <button class="submit" type="submit">生成</button>
      </form>
    </div>

    <div class="preview">
      <h3>在线预览</h3> 
      <iframe src="src/assets/preview2.pdf"></iframe>
      <!-- <img src="src/assets/a11.jpeg" > -->
    </div>
    
  </div>
</template>

<!-- <script src="pdf.js"></script>
<script src="pdf.worker.js"></script> -->
<!-- <script src="node_modules/pdfjs-dist/build/pdf.min.js"></script> -->
<script>

// import pdf from "https://mozilla.github.io/pdf.js/build/pdf.js"

export default {
  data() {
    return {
      items:[
        {name: '科目', opts:['语文','数学','英语']},
        {name: '年级', opts:['初一','初二','初三','高一','高二','高三']},
        {name: '考试类型', opts:['中考','高考','考研','CET4考试','CET6考试']}
      ],
      actives: [-1,-1,-1],
      pageNumber: '',
      problemNumber: '',
      size: '',
      addtion: '',
      answer:false,
      name:'未命名',
      // 其他参数
    };
  },
  methods: {
    submitParameters() {
      // 处理参数提交逻辑
      console.log('Parameters submitted:', this.parameter1, this.parameter2);
      // 这里可以添加代码将参数发送到服务器或其他逻辑
    },
    switchActive(idx,idx2){
      if(this.actives[idx]!==idx2)
        this.actives[idx]=idx2
      else 
        this.actives[idx]=-1
    }
  },
  computed:{
    entryPreview(){
      let subject=this.items[0].opts[this.actives[0]]
      let grade=this.items[1].opts[this.actives[1]]
      let exam=this.items[2].opts[this.actives[2]]
      let ret=''
      if(exam && subject){
        ret+='请你严格按照'+exam+'的格式，帮我生成一份'+subject+'试卷'
        if(this.pageNumber)
          ret+='，页数为：'+this.pageNumber
        if(this.problemNumber)
          ret+='，题数为：'+this.problemNumber
        if(this.answer)
          ret+='，生成一张试题卷后附带生成一张答案卷'
        else
          ret+='，不附带答案'
        if(this.addtion)
          ret+='，另外，'+this.addtion
      }
      return ret
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 200%;
}

.preview {
  width: 50%;
  padding: 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.preview h3{
  font-size: 25px;
  font-weight: 1000;
}

.preview iframe{
  margin-top: 20px;
  height: 600px;
}

.preview img{
  padding:30px;
}

.parameters {
  width: 50%;
  padding: 20px;
  box-sizing: border-box;
}

form {
  padding:50px;
  display: flex;
  flex-direction: column;
  font-size: 18px;
}

.select-row{
  display: flex;
  margin-bottom: 20px;
}

.select-opt{
  margin-left:20px;
  border: 1px solid grey;
  border-radius: 5px;
  padding-left:10px;
  padding-right:10px;
}

.select-opt:hover{
  background-color: #E1E1E1;
  transition: 0.3s;
}

.active{
  background-color: #409EFF;
  color:#fff;
}

.active:hover{
  background-color: #1D91E8; 
}

.submit {
  margin-top: 20px;
  background-color: #409EFF;
  border:none;
  color:#fff;
  font-size: 18px;
  border-radius: 20px;
  height: 40px;
}

.submit:hover {
  background-color: #1D91E8; 
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
}

.defines{
  display: flex;
  margin-bottom:20px;
}

.define{
  margin-right:37px;
}

.define input{
  margin-left:10px;
  height: 30px;
  font-size:18px;
  width: 70px;
}

.answer-attach{
  display: flex;
  gap:20px;
  margin-bottom: 20px;
}

.answer-attach input{
  width: 25px;
}

.addtion{
  margin-bottom: 20px;
}

.addtion input{
  margin-left:10px;
  height: 30px;
  font-size:18px;
  width: 500px;
}

.name input{
  margin-left:10px;
  height: 30px;
  font-size:18px;
  width: 500px;
}

.entry-preview{
  margin-top:20px;
  display: flex;
  flex-direction: column;
}

.entry-preview textarea{
  font-size:16px;
  padding:15px;
  margin-top:10px;
  width: 500px;
  height: 120px;
  text-indent:18px;
}
</style>