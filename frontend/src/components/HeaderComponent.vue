<template>
  <header class="bg-primary text-black shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <!-- LOGO -->
      <router-link to="/" class="flex items-center cursor-pointer">
        <img
          src="../assets/logoexplorateurV2.1.png"
          class="h-16 w-auto object-contain"
          alt="Logo"
        />
      </router-link>

      <!-- BOUTON BURGER -->
      <button @click="toggleMenu" class="flex flex-col gap-1 w-8 hover:cursor-pointer">
        <span class="h-1 bg-secondary rounded"></span>
        <span class="h-1 bg-secondary rounded"></span>
        <span class="h-1 bg-secondary rounded"></span>
      </button>
    </div>
  </header>

  <!-- OVERLAY -->
  <div
    v-if="menuOpen"
    class="fixed inset-0 bg-black/30 z-40 transition-all duration-300"
    @click="closeMenu"
  ></div>

  <!-- MENU LATÉRAL -->
  <aside
    class="fixed top-0 right-0 h-full w-64 bg-primary-background shadow-xl z-50 transform transition-transform duration-300"
    :class="menuOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="p-6 flex flex-col justify-between gap-6 h-full">
      <nav v-if="auth.isLoggedIn && auth.profile" class="flex flex-col gap-4 font-semibold text-lg">
        <span>
          <p>{{ auth.profile.firstName }} {{ auth.profile.lastName }}</p>
        </span>
        <router-link
          to="/family-dashboard"
          @click="closeMenu"
          class="-my-1 py-1 text-center rounded-3xl duration-300 text-text bg-primary/25 hover:bg-primary/50"
          >Ma famille</router-link
        >
        <router-link
          to="/schedule"
          @click="closeMenu"
          class="-my-1 py-1 text-center rounded-3xl duration-300 text-text bg-primary/25 hover:bg-primary/50"
          >Emploie du temps</router-link
        >
        <router-link
          to="/"
          @click="closeMenu"
          class="-my-1 py-1 text-center rounded-3xl duration-300 text-text bg-primary/25 hover:bg-primary/50"
          >Inscrire un enfant</router-link
        >

        <div class="mt-auto">
          <button
            @click="HandleLogout"
            class="block w-full text-center bg-error text-primary-light py-3 rounded-full font-semibold cursor-pointer duration-300 shadow-md shadow-primary-background transition-all hover:scale-105 hover:shadow-lg hover:shadow-error/50"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <!-- Admin -->
      <nav v-else-if="auth.isLoggedIn" class="flex flex-col gap-4 font-semibold text-lg">
        <span v-if="roleUser.data.role === 'OWNER'">
          <p>ADMINISTRATEUR</p>
        </span>
        <span v-else>
          <p>ANIMATEUR</p>
        </span>
        <router-link
          to="/admin"
          @click="closeMenu"
          class="-my-1 py-1 text-center rounded-3xl duration-300 text-text bg-primary/25 hover:bg-primary/50"
        >
          Panel Admin
        </router-link>
        <div class="mt-auto">
          <button
            @click="HandleLogout"
            class="block w-full text-center bg-error text-primary-light py-3 rounded-full font-semibold cursor-pointer duration-300 shadow-md shadow-primary-background transition-all hover:scale-105 hover:shadow-lg hover:shadow-error/50"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <!-- Déconnecté -->
      <nav v-else class="flex flex-col gap-4 font-semibold text-lg">
        <router-link
          to="/login"
          class="bg-secondary px-5 py-2 text-center rounded-full font-semibold"
        >
          Connexion
        </router-link>
      </nav>

      <!-- THEME & ACCENT -->
      <ThemeChooser />
    </div>
  </aside>
</template>

<script setup lang="ts">
import ThemeChooser from '@/components/ThemeChooser.vue'
import { ref } from 'vue'
import { logout } from '@/services/authServices'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { role } from '@/services/authServices'

const router = useRouter()
const auth = useAuthStore()

interface RoleResponse {
  data: {
    role: 'OWNER' | 'INSTRUCTOR' | 'GUARDIAN' | string
  }
}

const roleUser = await(role ()) as RoleResponse

console.log(roleUser)

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

async function HandleLogout() {
  await logout()
  auth.clear()
  closeMenu()
  router.push('/login')
}
</script>
