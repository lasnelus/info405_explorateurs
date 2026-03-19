<template>
  <div>
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


// cmmnia7ep000098m2fa7xzd16

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { getFamily} from "@/services/familyServices"
import { useAuthStore } from "@/stores/auth"
import { useRoute, useRouter } from "vue-router"
import { loadProfileIfNeeded } from "@/services/authServices"

const route = useRoute()

const router = useRouter()

const familyId = route.query.familyId

const auth = useAuthStore()

const family = ref(null)

onMounted(async () => {
  if (!auth.isLoggedIn) {
    router.push('/login')
    return
  }

  await loadProfileIfNeeded(auth)

  const res = await getFamily(familyId)
  family.value = res.data
})
</script>
