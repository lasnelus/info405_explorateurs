<template>
  <div>
    <h1>Inscription</h1>

    <p>{{ activity }} • {{ date }}</p>

    <p v-if="profile">
      Parent : {{ profile.firstName }} {{ profile.lastName }}
    </p>
    <p v-if="profile">
      Email : {{ profile.email }}
    </p>

    <div>
      <select v-if="options.length" v-model="selectedOption">
        <option disabled value="">Choisir un enfant</option>

        <option
          v-for="child in options"
          :key="child.id"
          :value="child.value"
        >
          {{ child.label }}
        </option>
      </select>

      <p v-else>Chargement des enfants...</p>
    </div>

    <button
      :disabled="!selectedOption"
      @click="submitRegistration"
    >
      Confirmer
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { getFamily } from "@/services/familyServices"
import { loadProfileIfNeeded } from "@/services/authServices"

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()


const activity = computed(() => (route.query.activity as string) || "")
const date = computed(() => (route.query.date as string) || "")


const profile = computed(() => auth.profile)

const selectedOption = ref("")

const options = ref<Array<{ id: string; label: string; value: string }>>([])


async function fetchChildren() {
  if (!profile.value) return

  try {
    const familyRequests = profile.value.families?.map((family: any) =>
      getFamily(family.id)
    ) || []

    const familiesData = await Promise.all(familyRequests)

    const childrenList: Array<{ id: string; label: string; value: string }> = []

    familiesData.forEach((familyResponse: any, index: number) => {
      const family = profile.value!.families[index]

      if (familyResponse.data.childs) {
        familyResponse.data.childs.forEach((child: any) => {
          childrenList.push({
            id: child.id,
            label: `${child.firstName} ${child.lastName} (${family.name})`,
            value: child.id
          })
        })
      }
    })

    options.value = childrenList
  } catch (error) {
    console.error("Erreur récupération enfants", error)
  }
}


watch(profile, async (newProfile) => {
  if (newProfile) {
    await fetchChildren()
  }
}, { immediate: true })

onMounted(async () => {
  if (!auth.isLoggedIn) {
    router.push("/login")
    return
  }

  await loadProfileIfNeeded(auth)
})

function submitRegistration() {
  console.log("Enfant choisi :", selectedOption.value)
}
</script>
