import { reactive } from 'vue'

export const store = reactive({
  login: false,
  user: {
    id: 0,
    username: "未登录",
    token: '',
    stuId: '',
    phone: '',
    email: '',
    imageUrl: '' ,
    createTime: [],
    
  },
  team: {
    id:1,
  },
  exam: {
    id: 1,

  },
})