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
            class="bg-primary/75 rounded-lg p-6 border-2 min-h-36 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all border-primary"
            @click="goToFamily(family.id)"
          >
            <span class="text-center">
              {{ family.name || `Famille ${family.id}` }}
            </span>
          </div>
        </div>

        <p v-else>Aucune famille associée.</p>
      </section>

      <!-- Activités à venir Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6 color-primary">Activités à venir</h2>

        <div v-if="allUpcomingActivities.length" class="space-y-3">
          <div
            v-for="activity in allUpcomingActivities"
            :key="activity.id"
            class="bg-primary/75 rounded-lg p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border-l-4"
            :style="{ borderColor: 'var(--color-primary)' }"
          >
            <h3 class="font-semibold color-primary">
              {{ activity.title }} — {{ activity.childName }}
            </h3>
            <span
              class="px-4 py-1 rounded-full text-sm font-semibold  inline-block mt-1"
              :class="activity.statusLabel === 'CONFIRMED' ? 'bg-success' : 'bg-warn'"
            >
              {{ activity.statusLabel }}
            </span>
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
            class="bg-primary/75 rounded-lg p-6 shadow-md border-l-4 border-secondary"
          >
            <div class="flex justify-between items-center">
              <span class="font-semibold text-text/75">
                {{ reg.childName }} — {{ reg.activityTitle }}
              </span>
              <span
                class="px-4 py-1 rounded-full text-sm font-semibold text-text"
                :class="reg.status === 'CONFIRMED' ? 'bg-secondary' : 'bg-gray-400'"
              >
                {{ reg.statusLabel }}
              </span>
            </div>
          </div>
        </div>

        <p v-else class="text-text/75">Aucune inscription.</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { getProfile, type Guardian, type Family } from "@/services/guardianService"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { loadProfileIfNeeded } from "@/services/authServices"
import { getFamily, getChild } from "@/services/familyServices"

const auth = useAuthStore()
const router = useRouter()

const guardian = ref<Guardian | null>(null)
const families = ref<Family[]>([])
const familiesWithChildren = ref<any[]>([])
const allSlots = ref<any[]>([])
const allQueues = ref<any[]>([])
const error = ref<string | null>(null)

const allUpcomingActivities = computed(() =>
  allSlots.value.map((slot: any) => ({
    id: `${slot.id}-${slot.childId ?? slot.child?.id ?? 'unknown'}`,
    title:  formatDate(slot.day),
    childName: slot.childName,
    statusLabel: "CONFIRMED",
  }))
)

const allRegistrations = computed(() =>
  allQueues.value.map((queue: any) => ({
    id: queue.id,
    childName: queue.childName,
    activityTitle: formatDate(queue.date),
    status: "PENDING",
    statusLabel: "EN ATTENTE",
  }))
)

const fetchGuardian = async () => {
  try {
    const res = await getProfile()
    guardian.value = res.data
    families.value = res.data.families || []
    await fetchFamilyAndChildren()
  } catch (e) {
    error.value = "Impossible de charger les données"
    console.error(e)
  }
}

const fetchFamilyAndChildren = async () => {
  try {
    const loaded = await Promise.all(
      families.value.map(async (family) => {
        const familyRes = await getFamily(family.id)
        const familyData = familyRes.data
        const childDetails = await Promise.all(
          (familyData.childs || []).map(async (child: any) => {
            const childRes = await getChild(child.id)
            return childRes.data
          }),
        )

        return {
          ...familyData,
          childs: childDetails,
        }
      }),
    )

    familiesWithChildren.value = loaded

    allSlots.value = loaded.flatMap((family) =>
      (family.childs || []).flatMap((child: any) =>
        (child.slots || []).map((slot: any) => ({
          ...slot,
          childId: child.id,
          childName: `${child.firstName} ${child.lastName}`,
          familyName: family.name,
        })),
      ),
    )

    allQueues.value = loaded.flatMap((family) =>
      (family.childs || []).flatMap((child: any) =>
        (child.queues || []).map((queue: any) => ({
          ...queue,
          childId: child.id,
          childName: `${child.firstName} ${child.lastName}`,
          familyName: family.name,
        })),
      ),
    )
  } catch (e) {
    error.value = "Impossible de charger les données des familles/enfants"
    console.error(e)
  }
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

onMounted(async () => {
  if (auth.isLoggedIn) {
    await loadProfileIfNeeded(auth)
    if (auth.profile != null) {
      await fetchGuardian()
    } else {
      router.push('/')
    }
  } else {
    router.push('/login')
  }
})

function goToFamily(familyId: string) {
  router.push({
    name: "famille",
    query: {
      familyId: familyId,
    },
  })
}
</script>

<style scoped>
</style>
