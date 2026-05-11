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
              {{ formatDate(activity.day) }} — {{ activity.childName }}
            </h3>
            <span
              class="px-4 py-1 rounded-full text-sm font-semibold  inline-block mt-1"
              :class="activity.statusLabel === 'CONFIRMED' ? 'bg-success/60' : 'bg-warn/60'"
            >
              {{ activity.statusLabel }}
            </span>
            <button
              @click.stop="unsubscribeActivity(activity.periodeId, activity.id)"
              class="px-4 py-1 rounded-full text-sm font-semibold  inline-block mt-1 bg-red-500/60 hover:bg-red-600/60 text-white transition"
            >
              Se désinscrire
            </button>
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
              <span class="font-bold text-lg text-text">
                {{ reg.activityName }}
              </span>
              <span class="font-semibold text-text/75">
                {{ formatDate(reg.day) }}
              </span>
              <span
                class="px-4 py-1 rounded-full text-sm font-semibold text-text"
                :class="reg.state === 'CONFIRMED' ? 'bg-secondary' : 'bg-gray-400'"
              >
                {{ reg.state }}
              </span>
              <button
                v-if="reg.state == 'ACCEPTED'"
                @click.stop="acceptQueue(reg.periodeId, reg.id)"
                class="bg-green-500/60 hover:bg-green-600/60 text-white px-4 py-2 rounded-lg transition"
              >
                Accepter
              </button>
              <button
                @click.stop="unsubscribeQueue(reg.periodeId, reg.id)"
                class="bg-red-500/60 hover:bg-red-600/60 text-white px-4 py-2 rounded-lg transition"
              >
                annuler
              </button>
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
import { loadProfileIfNeeded } from "@/services/authServices"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { getFamily } from "@/services/familyServices"
import { getChild } from "@/services/childServices"
import { acceptSlot, leaveActivity, leaveQueue } from "@/services/activityServices"

export interface Slot {
  id: string
  child: Child
  periodeId: string
  day: string
  isChildPresent: boolean
}

export interface Queue {
  id: string
  child: Child
  periodeId: string
  day: string
  state: string
  acceptedAt: string
}

export interface Child {
  id: string
  firstName: string
  lastName: string
  slots?: Slot[]
  queues?: Queue[]
}

interface FamilyWithChildren extends Family {
  childs?: Child[]
}

interface EnrichedSlot extends Slot {
  childId: string
  childName: string
  familyName?: string
}

interface EnrichedQueue extends Queue {
  childId: string
  childName: string
  familyName?: string
}


const auth = useAuthStore()
const router = useRouter()

const guardian = ref<Guardian | null>(null)
const families = ref<Family[]>([])
const allSlots = ref<EnrichedSlot[]>([])
const allQueues = ref<EnrichedQueue[]>([])
const familiesWithChildren = ref<FamilyWithChildren[]>([])
const error = ref<string | null>(null)

const allUpcomingActivities = computed(() =>
  allSlots.value.map((slot) => ({
    id: slot.id,
    day: slot.day,
    childName: slot.childName,
    statusLabel: "CONFIRMED",
    isConfirmed: slot.isChildPresent,
    periodeId: slot.periodeId,
  }))
)

const allRegistrations = computed(() =>
  allQueues.value.map((queue) => ({
    id: queue.id,
    child: queue.child,
    periodeId: queue.periodeId,
    activityName: activityTitles.value[queue.periodeId] || "Chargement...",
    day: formatDate(queue.day),
    childName: queue.childName,
    state: queue.state,
  }))
);

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
          (familyData.childs || []).map(async (child: Child) => {
            const childRes = await getChild(child.id)
            return childRes.data
          }),
        )

        return {
          ...familyData,
          childs: childDetails,
        } as FamilyWithChildren
      }),
    )

    familiesWithChildren.value = loaded

    allSlots.value = loaded.flatMap((family) =>
      (family.childs || []).flatMap((child: Child) =>
        (child.slots || []).map((slot: Slot) => ({
          ...slot,
          childId: child.id,
          childName: `${child.firstName} ${child.lastName}`,
          familyName: family.name,
        })),
      ),
    )

    allQueues.value = loaded.flatMap((family) =>
      (family.childs || []).flatMap((child: Child) =>
        (child.queues || []).map((queue: Queue) => ({
          ...queue,
          childId: child.id,
          childName: `${child.firstName} ${child.lastName}`,
          familyName: family.name,
        })),
      ),
    )
    const ids = [
      ...allSlots.value.map(s => s.periodeId),
      ...allQueues.value.map(q => q.periodeId)
    ];
    
    if (ids.length > 0) {
      await loadActivityTitles(ids);
    }
  } catch (e) {
    error.value = "Impossible de charger les données des familles/enfants"
    console.error(e)
  }
}

const unsubscribeActivity = async (periodeId: string, slotId: string) => {
  try {
    await leaveActivity(periodeId, slotId)

    // refresh des données
    await fetchGuardian()
    router.go(0)
  } catch (e) {
    console.error(e)
    alert("Impossible de se désinscrire")
  }
}

const unsubscribeQueue = async (periodeId: string, queueId: string) => {
  try {
    await leaveQueue(periodeId, queueId)

    // refresh des données
    await fetchGuardian()
    router.go(0)
  } catch (e) {
    console.error(e)
    alert("Impossible de se désinscrire")
  }
}

const acceptQueue = async (periodeId: string, queueId: string) => {
  try{
    await acceptSlot(periodeId, queueId)
    await fetchGuardian()
    router.go(0)
  } catch (e){
    console.error(e)
    alert("Impossible d'accepter la place")
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

import { getActivity } from '@/services/activityServices'; // Assurez-vous de l'import

const activityTitles = ref<Record<string, string>>({});

async function loadActivityTitles(ids: string[]) {
  // On filtre pour ne pas recharger un titre qu'on a déjà
  const uniqueIds = [...new Set(ids)].filter(id => !activityTitles.value[id]);
  
  // On lance tous les appels en parallèle
  await Promise.all(uniqueIds.map(async (id) => {
    try {
      const res = await getActivity(id);
      activityTitles.value[id] = res.data.title; // On stocke le titre
    } catch (e) {
      console.error(`Erreur chargement activité ${id}`, e);
      activityTitles.value[id] = "Activité inconnue";
    }
  }));
}

onMounted(async () => {
  if (auth.isLoggedIn) {
    await loadProfileIfNeeded(auth)
    if (auth.profile != null) {
      // fetchGuardian appelle fetchFamilyAndChildren qui appelle loadActivityTitles
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
