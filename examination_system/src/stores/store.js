import { reactive } from 'vue'

export const store = reactive({
  login: false,
  isAdmin: false,
  user: {
    id: null,
    username: "",
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