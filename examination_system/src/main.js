import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// element-ui plus 的引入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
// icon 图标引入
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// icon 图标挂载
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
// 挂载到app实例上
app.use(ElementPlus)
app.mount('#app')
