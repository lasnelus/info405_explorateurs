<template>
  <div v-if="profile">
    <p>
      {{ family?.name }}
    </p>
  </div>
  <div v-for="guardian in family?.guardians" :key="guardian.id">
    {{ guardian.firstName }} {{ guardian.lastName }}
  </div>
  <div v-for="child in family?.childs" :key="child.id">
    {{ child.firstName }} {{ child.lastName }}
  </div>
</template>

<script setup lang="ts">

// cmmnia7ep000098m2fa7xzd16

import { ref, onMounted } from "vue"
import { getFamily} from "@/services/familyServices"
import { useAuthStore } from "@/stores/auth"
import { useRoute } from "vue-router"

const route = useRoute()

const familyId = route.query.familyId

const auth = useAuthStore()

const profile = JSON.parse(auth.profile)

const family = ref(null)

onMounted(async () => {
  const res = await getFamily(familyId)
  family.value = res.data
})
</script>
