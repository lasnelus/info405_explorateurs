<template>
  <div class="mt-5 max-w-2xl mx-auto px-6 py-12 bg-primary/10 rounded-lg shadow-lg shadow-primary/15">
    <h1 class="text-3xl font-bold color-primary mb-6">
      Inscription à l'activité
    </h1>

    <!-- Activity Info -->
    <div class="bg-primary-background p-6 rounded-lg shadow-md shadow-primary/15 mb-6">
      <p class="text-lg font-semibold text-text">
        Période sélectionnée : {{ periodId }}
      </p>
      <p class="text-sm text-text/60">
        Date : {{ date }}
      </p>
    </div>

    <!-- Parent Info -->
    <div v-if="profile" class="bg-primary-100/25 p-5 rounded-lg mb-6 shadow-sm">
      <p class="text-text font-medium">
        {{ profile.firstName }} {{ profile.lastName }}
      </p>
      <p class="text-text/60 text-sm">
        {{ profile.email }}
      </p>
    </div>

    <!-- Child Selection -->
    <div class="mb-8">
      <label class="block text-sm font-semibold color-primary mb-2">
        Choisir un enfant
      </label>

      <select
        v-if="options.length"
        v-model="selectedOption"
        class="
          w-full
          px-4
          py-2
          h-11
          border border-primary
          rounded-lg
          bg-primary/10
          text-text
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-primary/40
        "
      >
        <option disabled value="">Sélectionner...</option>

        <option
          v-for="child in options"
          :key="child.id"
          :value="child.value"
        >
          {{ child.label }}
        </option>
      </select>

      <p v-else class="text-gray-500 italic">
        Chargement des enfants...
      </p>
    </div>

    <!-- Action Button -->
    <button
      :disabled="!selectedOption"
      @click="submitRegistration"
      class="
        w-full
        py-3
        rounded-xl
        font-semibold
        transition-all
        duration-300

        bg-primary
        text-primary-light

        disabled:opacity-50
        disabled:cursor-not-allowed

        hover:scale-105
        hover:shadow-lg
        hover:shadow-primary/20
      "
    >
      Confirmer l'inscription
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { getFamily } from "@/services/familyServices"
import { loadProfileIfNeeded } from "@/services/authServices"
import { registerChildToActivity } from "@/services/activityServices"

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const periodId = computed(() => (route.query.periodId as string) || "")
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

onMounted(async () =>{
  if(auth.isLoggedIn){
    await loadProfileIfNeeded(auth)
    if (auth.profile == null) {
      router.push('/')
    }
  } else {
    router.push('/login')
  }
})

function submitRegistration() {
  if (!selectedOption.value || !periodId.value || !date.value) {
    console.error("Informations manquantes pour l'inscription")
    return
  }

  const isoDate = date.value  // Already in yyyy-mm-dd format

  console.log("Enfant sélectionné :", selectedOption.value)
  console.log("Période ID :", periodId.value)
  console.log("Date ISO :", isoDate)

  registerChildToActivity(selectedOption.value, periodId.value, isoDate)
}
</script>
