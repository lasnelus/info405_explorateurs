<template>
  <div v-if="profile">
    <p>
      {{ family?.name }}
    </p>
  </div>
  <div v-for="child in family?.children" :key="child.id">
    {{ child.firstName }} {{ child.lastName }}
  </div>
</template>

<script setup>

// cmmnia7ep000098m2fa7xzd16

import { ref, onMounted } from "vue"
import { getFamily} from "@/services/familyServices"
import { useAuthStore } from "@/stores/auth"

const auth = useAuthStore()

const profile = JSON.parse(auth.profile)

const family = ref(null)

onMounted(async () => {
  const res = await getFamily("cmmnia7ep000098m2fa7xzd16")
  family.value = res.data
})
</script>