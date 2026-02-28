<template>
  <header class="bg-primary text-black shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      
      <!-- LOGO -->
      <router-link to="/" class="flex items-center cursor-pointer">
        <img src="../assets/logoexplorateurV2.1.png" class="h-16 w-auto object-contain" alt="Logo" />
      </router-link>

      <!-- BOUTON BURGER -->
      <button
        @click="toggleMenu"
        class="flex flex-col gap-1 w-8"
      >
        <span class="h-1 bg-black rounded"></span>
        <span class="h-1 bg-black rounded"></span>
        <span class="h-1 bg-black rounded"></span>
      </button>
    </div>
  </header>

  <!-- OVERLAY -->
  <div
    v-if="menuOpen"
    class="fixed inset-0 bg-black/30 z-40"
    @click="closeMenu"
  ></div>

  <!-- MENU LATÉRAL -->
  <aside
    class="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300"
    :class="menuOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="p-6 flex flex-col gap-6 h-full">

      <nav class="flex flex-col gap-4 font-semibold text-lg">
        <router-link to="/family-dashboard" @click="closeMenu">Ma famille</router-link>
        <router-link to="/" @click="closeMenu">lorem ipsum</router-link>
        <router-link to="/" @click="closeMenu">lorem ipsum</router-link>
        <router-link to="/" @click="closeMenu">Inscrire un enfant</router-link>
      </nav>

      <div class="mt-auto">
        <router-link
          to="/login"
          class="block text-center bg-green-secondary py-3 rounded-full font-semibold"
          @click="closeMenu"
        >
          Connexion
        </router-link>
      </div>

    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from "vue"

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}
</script>
