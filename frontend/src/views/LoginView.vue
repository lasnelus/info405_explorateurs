<template>
  <div class="min-h-screen flex justify-center items-center p-6">
    <div class="flex flex-col gap-6 w-full max-w-sm">
      <!-- Formulaire de connexion -->
      <div class="
      bg-primary-background
      rounded-2xl
      shadow-lg p-10
      ">
        <form @submit.prevent="handleLogin">
          <div v-if="error" class="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {{ error }}
          </div>

          <div class="mb-6">
            <input type="email" v-model="email" placeholder="EMAIL"
              :disabled="isLoading"
              class="
                w-full
                px-4 py-3.5
                rounded-lg
                font-semibold text-sm text-gray-800 placeholder:text-gray-500
                focus:outline-none transition-all
                bg-secondary-light
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              :style="{
                '--tw-ring-color': 'var(--color-primary)'
              }" required />
          </div>

          <div class="mb-6 relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="PSW"
              :disabled="isLoading"
              class="
              w-full
              px-4 py-3.5
              rounded-lg
              font-semibold text-sm text-gray-800 uppercase placeholder:text-gray-500
              focus:outline-none transition-all
              bg-secondary-light
              disabled:opacity-50 disabled:cursor-not-allowed
              "
              :style="{
                '--tw-ring-color': 'var(--color-primary)'
              }" required />
            <button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 p-2 rounded"
              :style="{ 'color': 'var(--color-primary)' }" @click="showPassword = !showPassword">
              <!-- eye icons omitted for brevity -->
            </button>
          </div>

          <div class="text-center mb-6">
            <a href="#" @click.prevent="handleForgotPassword" class="hover:underline text-sm transition-colors"
              :style="{ 'color': 'var(--color-primary)' }">
              mot de passe oublié ?
            </a>
          </div>

          <button type="submit"
            :disabled="isLoading"
            class="w-full py-3 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
            :style="{ 'backgroundColor': 'var(--color-primary)' }">
            {{ isLoading ? 'Connexion...' : 'Connexion' }}
          </button>
        </form>
      </div>

      <!-- Inscription -->
      <div class="bg-primary-background rounded-2xl shadow-lg p-6">
        <div class="flex flex-col items-center gap-4">
          <p class="text-sm font-semibold tracking-wide" :style="{ 'color': 'var(--color-primary)' }">PAS DE COMPTE ?
          </p>
          <button @click="goToSignup"
            class="w-full py-2.5 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
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
import { login } from '@/services/authServices'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const response = await login(email.value, password.value)
    const accessToken = response.data.accessToken

    auth.setAccessToken(accessToken)

    router.push('/')
  } catch (err) {
    error.value = 'Identifiants invalides. Veuillez réessayer.'
    console.error('Erreur de connexion:', err)
  } finally {
    isLoading.value = false
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
