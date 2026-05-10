<template>
  <div class="mt-5 max-w-2xl mx-auto px-6 py-12 bg-primary/10 rounded-lg shadow-lg shadow-primary/15">
    <h1 class="text-3xl font-bold color-primary mb-2">
      Inscription à l'activité : {{ activity?.title || '...' }}
    </h1>

    <p v-if="activity?.description" class="text-text/80 mb-6 italic">
      {{ activity.description }}
    </p>

    <div class="bg-primary-background p-6 rounded-lg shadow-md shadow-primary/15 mb-6">
      <p class="text-lg font-semibold text-text">
        Date : {{ date }}
      </p>
    </div>

    <div v-if="profile" class="bg-primary-100/25 p-5 rounded-lg mb-6 shadow-sm">
      <p class="text-text font-medium">
        {{ profile.firstName }} {{ profile.lastName }}
      </p>
      <p class="text-text/60 text-sm">
        {{ profile.email }}
      </p>
    </div>

    <div class="mb-8">
      <label class="block text-sm font-semibold color-primary mb-2">
        Choisir un enfant
      </label>

      <select
        v-if="options.length"
        v-model="selectedOption"
        class="w-full px-4 py-2 h-11 border border-primary rounded-lg bg-primary/10 text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
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

    <p v-if="errorMessage" class="mb-4 text-center text-red-600">{{ errorMessage }}</p>

    <button
      :disabled="!selectedOption || !activity"
      @click="submitRegistration"
      class="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-primary text-primary-light disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
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
import { registerChildToActivity, getActivity } from "@/services/activityServices" // Import ajouté

/* ---------------- TYPES ---------------- */

interface Activity {
  id: string
  title: string
  description?: string
  // Ajoute d'autres champs si nécessaire selon ton API
}

interface Child {
  id: string
  firstName: string
  lastName: string
}

interface Family {
  id: string
  name: string
  childs?: Child[]
}

interface Profile {
  firstName: string
  lastName: string
  email: string
  families?: Family[]
}

interface ChildOption {
  id: string
  label: string
  value: string
}

/* ---------------- SETUP ---------------- */

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const periodId = computed(() => (route.query.periodId as string) || "")
const date = computed(() => (route.query.date as string) || "")

const profile = computed<Profile | null>(() => auth.profile)
const activity = ref<Activity | null>(null) // State pour l'activité

const selectedOption = ref<string>("")
const errorMessage = ref<string>("")
const options = ref<ChildOption[]>([])

/**
 * Récupère les détails de l'activité
 */
async function fetchActivityDetails() {
  if (!periodId.value) return
  try {
    const response = await getActivity(periodId.value)
    // On part du principe que ton service renvoie l'objet dans .data
    activity.value = response.data
  } catch (err) {
    console.error("Erreur récupération activité", err)
    errorMessage.value = "Impossible de charger les détails de l'activité."
  }
}

async function fetchChildren() {
  if (!profile.value?.families?.length) return

  try {
    const familiesData = await Promise.all(
      profile.value.families.map((family) => getFamily(family.id))
    )

    const childrenList: ChildOption[] = []

    familiesData.forEach((familyResponse, index) => {
      const familyMeta = profile.value!.families?.[index]
      const childs: Child[] = familyResponse?.data?.childs ?? []

      childs.forEach((child) => {
        childrenList.push({
          id: child.id,
          label: `${child.firstName} ${child.lastName} (${familyMeta?.name ?? ""})`,
          value: child.id,
        })
      })
    })

    options.value = childrenList
  } catch (err: unknown) {
    console.error("Erreur récupération enfants", err)
  }
}

watch(profile, async (newProfile) => {
  if (newProfile) {
    await fetchChildren()
  }
}, { immediate: true })

onMounted(async () => {
  // 1. Check Auth
  if (auth.isLoggedIn) {
    await loadProfileIfNeeded(auth)
    if (auth.profile == null) {
      router.push('/')
      return
    }
  } else {
    router.push('/login')
    return
  }

  // 2. Fetch Activity
  await fetchActivityDetails()
})

async function submitRegistration() {
  errorMessage.value = ""

  if (!selectedOption.value || !periodId.value || !date.value) {
    errorMessage.value = "Informations manquantes pour l'inscription"
    return
  }

  try {
    await registerChildToActivity(selectedOption.value, periodId.value, date.value)
    router.push({
      name: "enfants",
      query: { childId: selectedOption.value }
    })
  } catch (error: unknown) {
    const errorStatus = (error as { response?: { status?: number } })?.response?.status
    if (errorStatus === 409) {
      errorMessage.value = "Cet enfant est déjà inscrit ce jour-ci."
    } else {
      errorMessage.value = "Une erreur est survenue lors de l'inscription."
    }
  }
}
</script>
