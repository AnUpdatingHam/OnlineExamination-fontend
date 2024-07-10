<template>

</template>

<script>
import axios from "axios";
import {constant} from "@/stores/constant";
import {store} from "@/stores/store";

export default {
  name: 'UserListView',

  data() {
    return {
      users: [
        {
          id: 1,
          stuId: 0,
          username: "testname1",
          password: "string",
          phone: "string",
          email: "string",
          imageUrl: "string",
          create_time: "2019-08-24T14:15:22Z"
        },
        {
          id: 2,
          stuId: 0,
          username: "testname2",
          password: "string",
          phone: "string",
          email: "string",
          imageUrl: "string",
          create_time: "2019-08-24T14:15:22Z"
        },
        // 新添加的用户对象
      ]
    };
  },
  
  //以下未测试
  async created() {
    try {
      //填入测试数据
      this.username = store.user.name
      this.page = 1
      this.pageSize = 10
      //请求历史作答记录
      const queryParams = {
        username: this.username,//需要修改
        page: this.page,//需要修改
        pageSize: this.pageSize//需要修改
      }

      const ret = await axios.get(`${constant.host}/user/user/page`, {params: queryParams})
      this.users = ret.data.data.records
      console.log(JSON.stringify(ret))

    } catch(error) {
      console.error("Getting Data Error:", error)
    }
  },
  methods: {
    async queryUserById(id) {
      try {
        const ret = await axios.get(`${constant.host}/user/user/${id}`)
        return ret.data.data
      } catch(error) {
        console.error("")
      }
    }
  }
};
</script>

<style scoped>

</style>
