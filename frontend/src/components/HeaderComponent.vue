<template>
  <header class="bg-primary text-black shadow-lg sticky top-0 z-100">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <router-link to="/" class="flex items-center cursor-pointer">
        <img src="../assets/logoexplorateurV2.1.png" class="h-16 w-auto object-contain" alt="Logo" />
      </router-link>
      <div class="flex gap-4 items-center">
        <router-link
          to="/login"
          class="bg-secondary px-7 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          Connexion
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
