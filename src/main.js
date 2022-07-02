import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import * as echarts from 'echarts'
import '@/assets/styles/reset.css'
import '@/assets/styles/iconfont.css'
import '@/assets/styles/home.css'
import '@/assets/styles/confirm.css'
import '@/assets/styles/global.css'
import '@/assets/css/global.css'
import './assets/css/icon.css';
const app = createApp(App)
    .use(store)
    .use(router)
    .use(ElementPlus, {size: 'small' })
    .mount('#app')
app.echarts = echarts
