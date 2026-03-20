<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-4xl mx-auto px-6 py-12">
        <h2 class="text-2xl font-bold mb-6 color-primary">Page d'administration</h2>
    </div>
  </div>
</template>

<script setup lang="ts">

import router from '@/router'
import { role } from '@/services/authServices'
import { onMounted } from 'vue'

const roleUser = await role()

onMounted(async () =>{
  if(roleUser.data.role != "OWNER"){
    router.push('/login')
  }
})

</script>

<style scoped>
</style>
