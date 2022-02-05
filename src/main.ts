import { createApp } from 'vue'
import Widget from './Widget.vue'
import router from './router'

createApp(Widget).use(router).mount('#cruise-app')
