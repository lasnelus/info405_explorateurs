<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <!-- Mes familles Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6 color-primary">Mes familles</h2>

        <div v-if="families.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="family in families"
            :key="family.id"
            class="bg-white rounded-lg p-6 border-2 min-h-36 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all border-primary"
            @click="goToFamily(family.id)"
          >
            <span class="text-gray-700 text-center">
              {{ family.name || `Famille ${family.id}` }}
            </span>
          </div>
        </div>

        <p v-else class="text-gray-500">Aucune famille associée.</p>
      </section>

      <!-- Activités à venir Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6 color-primary">Activités à venir</h2>

        <div v-if="allUpcomingActivities.length" class="space-y-3">
          <div
            v-for="activity in allUpcomingActivities"
            :key="activity.id"
            class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border-l-4"
            :style="{ borderColor: 'var(--color-primary)' }"
          >
            <h3 class="font-semibold color-primary">
              {{ activity.title }} — {{ activity.childName }}
            </h3>
            <p class="text-sm text-gray-600 mt-2">
              {{ activity.statusLabel }}
            </p>
          </div>
        </div>

        <p v-else class="text-gray-500">Aucune activité à venir.</p>
      </section>

      <!-- État des inscriptions Section -->
      <section>
        <h2 class="text-2xl font-bold mb-6 color-primary">État des inscriptions</h2>

        <div v-if="allRegistrations.length" class="space-y-3">
          <div
            v-for="reg in allRegistrations"
            :key="reg.id"
            class="bg-white rounded-lg p-6 shadow-md border-l-4 border-secondary"
          >
            <div class="flex justify-between items-center">
              <span class="font-semibold text-gray-800">
                {{ reg.childName }} — {{ reg.activityTitle }}
              </span>
              <span
                class="px-4 py-1 rounded-full text-sm font-semibold text-white"
                :class="reg.status === 'CONFIRMED' ? 'bg-secondary' : 'bg-gray-400'"
              >
                {{ reg.statusLabel }}
              </span>
            </div>
          </div>
        </div>

        <p v-else class="text-gray-500">Aucune inscription.</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { getProfile, type Guardian, type Family } from "@/services/guardianService"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const auth = useAuthStore()

const router = useRouter()

const guardian = ref<Guardian | null>(null)
const families = ref<Family[]>([])
const error = ref<string | null>(null)

const fetchGuardian = async () => {
  try {
    const res = await getProfile()
    guardian.value = res.data
    families.value = res.data.families || []
  } catch (e) {
    error.value = "Impossible de charger les données"
    console.error(e)
  }
}

const profile = JSON.parse(auth.profile)

onMounted(async () =>{
  if(profile){
    await fetchGuardian()
  } else {
    router.push('/login')
  }
})

const allUpcomingActivities = computed(() => {
  return families.value.flatMap(family =>
    family.children?.flatMap(child =>
      (child.upcomingActivities || []).map(activity => ({
        id: activity.id,
        title: activity.title,
        childName: `${child.firstName} ${child.lastName}`,
        statusLabel: activity.status === "PENDING"
          ? "Activité prévue en attente de confirmation"
          : "Activité confirmée"
      }))
    ) || []
  )
})

// Toutes les inscriptions de tous les enfants de toutes les familles
const allRegistrations = computed(() => {
  return families.value.flatMap(family =>
    family.children?.flatMap(child =>
      (child.registrations || []).map(reg => ({
        id: reg.id,
        activityTitle: reg.activityTitle,
        childName: `${child.firstName} ${child.lastName}`,
        status: reg.status,
        statusLabel: reg.status === "CONFIRMED" ? "Inscrit" : "En attente"
      }))
    ) || []
  )
})

function goToFamily(familyId:string){
  router.push({
    name: "famille",
    query: {
      familyId: familyId
    }
  })
}
</script>

<style scoped>
</style>
