<template>
  <div class="max-w-3xl mx-auto px-6 py-12 bg-primary/10 rounded-lg shadow-lg shadow-primary/15">
    <!-- Family Name -->
    <div class="bg-primary-background p-6 rounded-lg shadow-md shadow-primary/15 mb-6">
      <h1 class="text-2xl font-bold color-primary">
        {{ family?.name || "Famille" }}
      </h1>
    </div>

    <!-- Guardians -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold color-primary mb-3">
        Responsables
      </h2>

      <div v-if="family?.guardians?.length" class="space-y-3">
        <div
          v-for="guardian in family.guardians"
          :key="guardian.id"
          class="bg-primary-100/25 p-4 rounded-lg shadow-sm"
        >
          <p class="font-medium text-text">
            {{ guardian.firstName }} {{ guardian.lastName }}
          </p>
        </div>
      </div>

      <p v-else class="text-gray-500 italic">
        Aucun responsable
      </p>
    </div>

    <!-- Children -->
    <div>
      <h2 class="text-lg font-semibold color-primary mb-3">
        Enfants
      </h2>

      <div v-if="family?.childs?.length" class="space-y-3">
        <button
          v-for="child in family.childs"
          :key="child.id"
          class="w-full text-left bg-primary-100/25 cursor-pointer p-4 rounded-lg shadow-md shadow-primary/10 hover:scale-[1.02] transition duration-300"
          @click = "gotoChild(child.id)"
        >
          <p class="font-medium text-text">
            {{ child.firstName }} {{ child.lastName }}
          </p>
        </button>
      </div>

      <p v-else class="text-gray-500 italic">
        Aucun enfant
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { getFamily } from "@/services/familyServices"
import { useAuthStore } from "@/stores/auth"
import { useRoute, useRouter } from "vue-router"
import { loadProfileIfNeeded } from "@/services/authServices"

const route = useRoute()
const router = useRouter()

const familyId = Array.isArray(route.query.familyId)
  ? route.query.familyId[0]
  : route.query.familyId

const auth = useAuthStore()

interface Family {
  id: string
  name: string
  guardians: {
    id: string
    firstName: string
    lastName: string
  }[]
  childs: {
    id: string
    firstName: string
    lastName: string
  }[]
}

const family = ref<Family>()

function gotoChild(childId : string) {
  router.push({
    name: "enfants",
    query : {
      childId: childId
    }
  })
}

onMounted(async () =>{
  if(auth.isLoggedIn){
    await loadProfileIfNeeded(auth)
    if (auth.profile != null && familyId) {
      const res = await getFamily(familyId)
      family.value = res.data
    } else {
      router.push('/')
    }
  } else {
    router.push('/login')
  }
})
</script>
