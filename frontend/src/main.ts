import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useColorStore } from '@/stores/colorStore'
import { useAuthStore} from '@/stores/auth'

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

const auth = useAuthStore()
await auth.init() // POST /auth/refresh avant le premier rendu

app.mount('#app')
