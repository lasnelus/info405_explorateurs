import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useColorStore } from '@/stores/colorStore'

import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)


app.use(createPinia())
app.use(router)

const color = useColorStore()
const accent = color.colorAccent

const theme  = color.colorTheme

document.body.classList.add(accent)
document.body.classList.add(theme)

console.log("Theme: " + theme)
console.log("Couleur d'accent : " + accent)

app.mount('#app')
