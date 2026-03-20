<template>
  <div>
    {{ child?.firstName }}
  </div>
</template>

<script setup lang="ts">

import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getChild } from '@/services/familyServices';
import { loadProfileIfNeeded } from '@/services/authServices';

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

onMounted(async () =>{
  if(auth.isLoggedIn){
    await loadProfileIfNeeded(auth)
    if (auth.profile != null) {
      getChildren()
    } else {
      router.push('/')
    }
  } else {
    router.push('/login')
  }
})

const childId = computed(() => route.query.tgId as string || "") // potentiellement bugué (|| "")

const child = ref(null)

const getChildren = async() => {
  try {
    const res = await getChild(childId)
    child.value = res.data
  } catch (e: any) {
    console.log(e)
  }

}
</script>
