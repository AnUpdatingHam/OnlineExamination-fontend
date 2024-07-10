<template>
  <el-row style="width: 100%;height: 100%;background-image: url('./src/assets/bg.svg');background-repeat: no-repeat;">
    <el-col :span="12"  style="width: 40%; display: flex;flex-direction: column;justify-content: center;align-items: center;">
      <h2 style="font-size:60px;font-weight:1000;margin-bottom: 20px;" >墨韵云阁</h2>
      <p style="margin-bottom:40px;font-size: 18px;font-weight: 400;">更加智能的在线考试系统</p>
      <div>
        <el-button type="primary" round style="border-radius: 40px;width: 128px;height: 52px;background-color: #0608E3;font-size: 18px;font-weight: 400;" @click="goToPaper">创建试卷</el-button>
      </div>
    </el-col>
    <el-col :span="12" style="width: 60%; display: flex;align-items: start;justify-content: center;">
      <img class="image1" src="../assets/test1.jpeg">
      <img class="image2" src="../assets/test2.jpg">
      <img class="image3" src="../assets/test3.jpg">
    </el-col>
  </el-row>

</template>

<script>

export default {
  methods:{
    goToTeam(){
      this.$router.push({name: 'team'})
    },
  },
  computed:{
  }

};
</script>

<style scoped>

.el-row {
    position: static;
}

img{
  border-radius: 40px;
  border: 10px solid #ffffff;
  position: absolute;
}

.image1{
  width:550px;
  margin-top:300px;
  margin-right:500px;
}

.image2{
  width:480px;
  margin-top:150px;
}

.image3{
  width:500px;
  margin-top:370px;
  margin-left:230px;
}


</style>