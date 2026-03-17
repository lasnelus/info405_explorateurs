<template>
  <div class="
    h-screen
    flex
    justify-center
    items-center
    p-6
  ">
    <div class="
      flex
      flex-col
      gap-6
      w-full
      max-w-sm
    ">
      <!-- Formulaire de connexion -->
      <div class="
        bg-primary-background
        rounded-2xl
        shadow-lg p-10
      ">
        <form @submit.prevent="handleLogin">
          <div class="mb-6">
            <input type="email" v-model="email" placeholder="EMAIL"
              class="
                w-full
                px-4 py-3.5
                rounded-lg outline-2 outline-primary
                font-semibold text-sm text-text placeholder:uppercase placeholder:text-gray-500
                focus:outline-secondary transition-all
                focus:bg-primary/5
                hover:outline-secondary
                hover:bg-primary/15
              "
              :style="{
                '--tw-ring-color': 'var(--color-primary)'
              }" required />
          </div>

          <div class="mb-6 relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="MDP"
              class="
                w-full
                px-4 py-3.5
                rounded-lg outline-2 outline-primary
                font-semibold text-sm text-text placeholder:uppercase placeholder:text-gray-500
                focus:outline-secondary transition-all
                focus:bg-primary/5
                hover:outline-secondary
                hover:bg-primary/15
              "
              :style="{
                '--tw-ring-color': 'var(--color-primary)'
              }" required />
            <button type="button" class="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-gray-500
              p-2
              rounded
              color-primary
              hover:color-secondary
              focus:color-secondary
              cursor-pointer
            "
              @click="showPassword = !showPassword">
              <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>

          <div class="text-center mb-6">
            <a href="#" @click.prevent="handleForgotPassword" class="hover:underline text-sm transition-colors"
              :style="{ 'color': 'var(--color-primary)' }">
              mot de passe oublié ?
            </a>
          </div>

          <button type="submit"
            class="cursor-pointer w-full py-3 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            :style="{ 'backgroundColor': 'var(--color-primary)' }">
            Connexion
          </button>
          <div v-if="error" class="text-red-500 mb-4 text-center">
            {{ error }}
          </div>
        </form>
      </div>

      <!-- Inscription -->
      <div class="bg-primary-background rounded-2xl shadow-lg p-6">
        <div class="flex flex-col items-center gap-4">
          <p class="text-sm font-semibold tracking-wide" :style="{ 'color': 'var(--color-primary)' }">PAS DE COMPTE ?
          </p>
          <button @click="goToSignup"
            class="cursor-pointer w-full py-2.5 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            :style="{ 'backgroundColor': 'var(--color-primary)' }">
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, role } from '@/services/authServices'
import { getProfile } from '@/services/guardianService'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const auth = useAuthStore()

const handleLogin = async () => {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Email et mot de passe requis'
    return
  }
  try {
    const response = await login(email.value, password.value)
    const token = response.data.accessToken
    auth.setAccessToken(token)

    const roleUser = await role()

    if (roleUser.data.role = "GUARDIAN") {
      const profileResponse = await getProfile()
      const profile = profileResponse.data

      auth.setProfile(profile)
      router.push('/family-dashboard')
    } else {
      router.push('/admin')
    }

  } catch (e: any) {
    // log server response if available
    console.error('Login error', e.response?.data || e)
    error.value =
      e.response?.data?.message ||
      'Identifiants invalides'
  }
}

const handleForgotPassword = () => {
  console.log('Mot de passe oublié')
}

const goToSignup = () => {
  router.push('/signup')
}
</script>

<style scoped></style>
