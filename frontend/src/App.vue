<script setup lang="ts">
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <suspense>
      <HeaderComponent />
    </suspense>
    <main class="grow">
      <suspense>
        <router-view />
      </suspense>
    </main>
    <FooterComponent />
  </div>
</template>

<style scoped></style>
