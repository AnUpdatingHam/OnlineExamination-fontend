import { reactive } from 'vue'

export const store = reactive({
  user: {
    id: 1,
    name: "张三",
  },
  team: {
    id:1,
  },
  exam: {
    id: 1,

  },
  token: '',

})