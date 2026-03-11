<template>
  <header class="bg-primary text-black shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

      <!-- LOGO -->
      <router-link to="/" class="flex items-center cursor-pointer">
        <img src="../assets/logoexplorateurV2.1.png" class="h-16 w-auto object-contain" alt="Logo" />
      </router-link>

      <!-- BOUTON BURGER SI CONNECTÉ -->
      <button
        v-if="isLoggedIn"
        @click="toggleMenu"
        class="flex flex-col gap-1 w-8"
      >
        <span class="h-1 bg-secondary rounded"></span>
        <span class="h-1 bg-secondary rounded"></span>
        <span class="h-1 bg-secondary rounded"></span>
      </button>

      <!-- BOUTON LOGIN SI PAS CONNECTÉ -->
      <router-link
        v-else
        to="/login"
        class="bg-green-secondary px-5 py-2 rounded-full font-semibold"
      >
        Connexion
      </router-link>
    </div>
  </header>

  <!-- OVERLAY -->
  <div
    v-if="menuOpen"
    class="fixed inset-0 bg-black/30 z-40 transition-all duration-300 "
    @click="closeMenu"
  ></div>

  <!-- MENU LATÉRAL -->
  <aside
    class="
    fixed top-0
    right-0
    h-full
    w-64
    bg-primary-background
    shadow-xl
    z-50
    transform
    transition-transform
    duration-300"
    :class="menuOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="p-6 flex flex-col gap-6 h-full">

      <nav class="flex flex-col gap-4 font-semibold text-lg">
        <router-link to="/family-dashboard" @click="closeMenu">Ma famille</router-link>
        <router-link to="/" @click="closeMenu">lorem ipsum</router-link>
        <router-link to="/" @click="closeMenu">lorem ipsum</router-link>
        <router-link to="/" @click="closeMenu">Inscrire un enfant</router-link>

        <div class="mt-auto">
          <button
            @click="logout"
            class="block w-full text-center bg-red-500 text-white py-3 rounded-full font-semibold"
          >
            Déconnexion
          </button>
        </div>
      </nav>

    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const auth = useAuthStore()

const menuOpen = ref(false)

const isLoggedIn = computed(() => {
  return !!auth.accessToken
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function logout() {
  auth.clearAccessToken()
  closeMenu()
  router.push("/login")
}
</script>
