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
      <!-- Formulaire d'inscription -->
      <div class="
        bg-primary-background
        rounded-2xl
        drop-shadow-lg
        drop-shadow-primary
        p-10
        transition duration-300
        delay-500
        hover:delay-0
        hover:drop-shadow-secondary
        hover:drop-shadow-xl
        hover:scale-101
      " id="signUpBox">
        <form @submit.prevent="handleSignup">
          <div class="mb-6 relative">
            <input
              type="text"
              placeholder="PRÉNOM"
              v-model="firstName"
              class="
                w-full
                px-4
                py-3.5
                rounded-lg
                outline-2
                outline-primary
                font-semibold
                text-sm
                text-text
                placeholder:uppercase
                focus:outline-secondary
                transition-all focus:bg-primary/5 hover:outline-secondary hover:bg-primary/15"
              required
            />
          </div>

          <div class="mb-6 relative">
            <input
              type="text"
              placeholder="NOM"
              v-model="lastName"
              class="w-full px-4 py-3.5 rounded-lg outline-2 outline-primary font-semibold text-sm text-text placeholder:uppercase focus:outline-secondary transition-all focus:bg-primary/5 hover:outline-secondary hover:bg-primary/15"
              required
            />
          </div>

          <div class="mb-6 relative">
            <input type="email" id="EMail" name="EMail" placeholder="EMAIL"
              v-model="email"
              class="
                w-full
                px-4 py-3.5
                rounded-lg outline-2 outline-primary
                font-semibold text-sm text-text placeholder:uppercase
                focus:outline-secondary transition-all
                focus:bg-primary/5
                hover:outline-secondary
                hover:bg-primary/15 "/>
          </div>

          <div class="mb-6 relative">
            <input :type="showPassword ? 'text' : 'password'" placeholder="MDP" autocomplete="new-password" id="Password" name="Password"
              v-model="password"
              class="
                w-full
                px-4 py-3.5
                rounded-lg outline-2 outline-primary
                font-semibold text-sm text-text placeholder:uppercase
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
              p-0
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

          <div class="mb-6 relative">
            <input :type="showPasswordConfirm ? 'text' : 'password'" placeholder="CONFIRMATION MDP" autocomplete="new-password" id="PasswordConfirm" name="PasswordConfirm"
              v-model="passwordConfirm"
              class="
                w-full
                px-4 py-3.5
                rounded-lg outline-2 outline-primary
                font-semibold text-sm text-text placeholder:uppercase
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
              p-0
              rounded
              color-primary
              hover:color-secondary
              focus:color-secondary
              cursor-pointer
            "
              @click="showPasswordConfirm = !showPasswordConfirm">
              <svg v-if="showPasswordConfirm" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
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
            <button type="submit"
              class="cursor-pointer w-full py-3 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              :style="{ 'backgroundColor': 'var(--color-primary)' }">
            S'inscrire
          </button>
          <div v-if="error" class="text-red-500 mt-4 text-center">
            {{ error }}
          </div>
        </form>
      </div>

      <!-- Login -->
      <div class="
        bg-primary-background
        rounded-2xl
        p-6
        drop-shadow-md
        drop-shadow-primary
        transition duration-300
        hover:drop-shadow-secondary
        hover:drop-shadow-lg
        hover:scale-101
      ">
        <div class="
          flex
          flex-col
          items-center
          gap-4
        ">
          <p class="
            text-sm
            font-semibold
            tracking-wide
          " :style="{ 'color': 'var(--color-primary)' }">DÉJA UN COMPTE ?
          </p>
          <button @click="goTologin"
            class="cursor-pointer w-full py-2.5 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            :style="{ 'backgroundColor': 'var(--color-primary)' }">
            Se connecter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signup } from '@/services/authServices'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const error = ref('')

const handleSignup = async () => {
  error.value = ''

  if (!firstName.value || !lastName.value || !email.value || !password.value || !passwordConfirm.value) {
    error.value = 'Tous les champs sont requis'
    return
  }

  if (password.value !== passwordConfirm.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  try {
    const response = await signup(
      email.value,
      password.value,
      firstName.value,
      lastName.value
    )

    const token = response.data.accessToken
    auth.setAccessToken(token)

    router.push('/family-dashboard')

  } catch (e: any) {
    console.error('Signup error', e.response?.data || e)
    error.value =
      e.response?.data?.message ||
      'Erreur lors de la création du compte'
  }
}

const goTologin = () => {
  router.push('/login')
}
</script>

<style scoped>
</style>
