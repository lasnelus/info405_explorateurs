<template>
  <div class="admin">
    <h1>Page d'administration</h1>
    <p>Bienvenue</p>
  </div>
</template>

<script setup lang="ts">

import router from '@/router'
import { role } from '@/services/authServices'
import { onMounted } from 'vue'

const roleUser = await role()

onMounted(async () =>{
  if(roleUser.data.role == "OWNER"){
    console.log("bonsoir")
  } else {
    console.log("CAHSOHTOA")
    router.push('/about')
  }
})

</script>

<style scoped>
</style>
