<template>
  <div class="min-h-screen bg-background">
    <!-- Placement du titre cohérent avec les autres pages -->
    <div class="mx-auto pt-12 pb-6 ml-64">
      <h2 v-if="roleUser.data.role == 'OWNER'" class="text-2xl font-bold mb-6 color-primary">
        Page d'administration
      </h2>
      <h2 v-else class="text-2xl font-bold mb-6 color-primary">Page Animateur</h2>
    </div>

    <!--  -->
    <div class="w-full mx-auto px-6 flex flex-row">
      <!-- Panneau latéral -->
      <div class="w-3xs mt-6 pl-3 py-3 rounded-l-xl bg-primary/25 inline-block h-fit">
        <!-- Aujourd'hui (default) -->
        <div class="mt-auto">
          <button
            @click="switch_to(0)"
            id="Aujourdhui"
            :class="{ activeButton: activeTab === 0 }"
            class="btn-side-panel rounded-tl-[6px]"
          >
            Aujourd'hui
          </button>

          <!-- Demain/Semaine (owner) -->
          <button
            @click="switch_to(1)"
            id="Demain"
            class="btn-side-panel"
            :class="{ activeButton: activeTab === 1 }"
          >
            Demain
          </button>

          <!-- Activitées -->
          <button
            @click="switch_to(2)"
            id="Activitees"
            class="btn-side-panel"
            :class="{ activeButton: activeTab === 2 }"
          >
            Activités
          </button>

          <!-- Groupes -->
          <!-- <button v-if="roleUser.data.role == 'OWNER'" @click="switch_to(3)" id="Groupes" class="btn-side-panel">Groupes</button> -->

          <!-- Enfants -->
          <button
            v-if="roleUser.data.role == 'OWNER'"
            @click="switch_to(4)"
            id="Enfants"
            :class="{ activeButton: activeTab === 4 }"
            class="btn-side-panel"
          >
            Enfants
          </button>

          <!-- Familles -->
          <button
            v-if="roleUser.data.role == 'OWNER'"
            @click="switch_to(5)"
            id="Familles"
            :class="{ activeButton: activeTab === 5 }"
            class="btn-side-panel"
          >
            Familles
          </button>

          <!-- Animateurs -->
          <button
            v-if="roleUser.data.role == 'OWNER'"
            @click="switch_to(6)"
            id="Animateurs"
            :class="{ activeButton: activeTab === 6 }"
            class="btn-side-panel rounded-bl-[6px]"
          >
            Animateurs
          </button>
        </div>
      </div>

      <div id="componentContainer" class="w-full h-fit pl-3 rounded-xl bg-primary/25 inline-block">
        <component
          :is="currentComponent"
          :today-childs="ChildrenToday"
          :tomorrow-childs="ChildrenTomorrow"
          :all-childs="allChildren"
          :all-activities="allActivities"
          @switch="switch_to"
        />
      </div>

      <!--  -->
    </div>
  </div>
</template>

<script setup lang="ts">
// ---------------
// --- IMPORTS ---

import TodayInfo from '@/components/admin/TodayInfo.vue'
import TomorowInfo from '@/components/admin/TomorowInfo.vue'
import ActivityManagement from '@/components/admin/ActivityManagement.vue'
import FamilyManagement from '@/components/admin/FamilyManagement.vue'
import StaffManagement from '@/components/admin/StaffManagement.vue'
import ChildManagement from '@/components/admin/ChildManagement.vue'

import router from '@/router'
import { role } from '@/services/authServices'
import { getChildren } from '@/services/childServices'
import { getActivities } from '@/services/activityServices'
import { computed, onMounted, ref, shallowRef, type Component } from 'vue'

interface Slot {
  day: string
}

interface Child {
  slots: Slot[]
}

interface Activity {
  id: number
  name: string
  description: string
  startTime: string
  endTime: string
}

interface RoleResponse {
  data: {
    role: 'OWNER' | 'INSTRUCTOR' | 'GUARDIAN' | string
  }
}

// -----------------
// --- CONSTANTS ---

const roleUser = (await role()) as RoleResponse

// Tab administrateur
const activeTab = ref(0)

// Composant régis par activeTab
const currentComponent = shallowRef<Component>(TodayInfo)

// Liste de tout les enfants
const allChildren = ref<Child[]>([])
const allActivities = ref<Activity[]>([])

// ---------------
// --- --- --- ---

onMounted(async () => {
  // Les utilisateurs "normaux" n'ont pas à acceder a cette page. Redirection sur /login
  if (roleUser.data.role != 'OWNER' && roleUser.data.role != 'INSTRUCTOR') {
    router.push('/login')
  }

  // --- GET ENFANTS ---
  try {
    const childResponse = await getChildren()
    allChildren.value = childResponse.data
  } catch (error) {
    console.error('Erreur lors de la récupération des enfants:', error)
  }

  // --- GET ACTIVITES ---
  try {
    const activitiesResponse = await getActivities()
    allActivities.value = activitiesResponse.data
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error)
  }
})

/**
 * Switches to a pannel depending on the said pannel
 * @param pannel pannel number
 */
function switch_to(pannel: number) {
  // On met simplement à jour le numéro de l'onglet actif
  activeTab.value = pannel

  switch (pannel) {
    case 0:
      currentComponent.value = TodayInfo
      break
    case 1:
      currentComponent.value = TomorowInfo
      break
    case 2:
      currentComponent.value = ActivityManagement
      break
    case 4:
      currentComponent.value = ChildManagement
      break
    case 5:
      currentComponent.value = FamilyManagement
      break
    case 6:
      currentComponent.value = StaffManagement
      break
    default:
      break
  }
}

// Requetes API
// --- GET ---

/**
 * Renvoie tout les enfants présents aujourd'hui
 */
const ChildrenToday = computed(() => {
  const today = new Date().toISOString().split('T')[0] ?? ''

  return allChildren.value.filter((enfant) =>
    enfant.slots.some((slot) => slot.day.startsWith(today)),
  )
})

const ChildrenTomorrow = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const tomorrowDate = tomorrow.toISOString().split('T')[0] ?? ''

  return allChildren.value.filter((enfant) =>
    enfant.slots.some((slot) => slot.day.startsWith(tomorrowDate)),
  )
})
</script>

<!-- Surtout ne pas scope ("<style scoped>"), casse les tables des sous components -->
<style>
.activeButton {
  background-color: var(--color-primary);
}

@layer components {
  .btn-side-panel {
    display: block;
    width: 100%;
    padding-block: calc(var(--spacing) * 3);

    background-color: color-mix(
      in oklab,
      var(--color-primary) /* var(--color-secondary-100) */ 50%,
      transparent
    );
    color: var(--color-text) /* var(--color-primary-background) */;

    text-align: center;

    border-right: 4px solid var(--color-primary);

    --tw-font-weight: var(--font-weight-semibold) /* 600 */;
    font-weight: var(--font-weight-semibold) /* 600 */;

    cursor: pointer;

    transition-property: all;
    transition-timing-function: var(
      --tw-ease,
      var(--default-transition-timing-function) /* cubic-bezier(0.4, 0, 0.2, 1) */
    );
    transition-duration: var(--tw-duration, var(--default-transition-duration) /* 150ms */);

    &:hover {
      @media (hover: hover) {
        background-color: var(--color-primary) /* var(--color-secondary-100) */;
      }
    }
  }
}

/* Tables */

table {
  --header-color: color-mix(in oklab, var(--color-primary) 50%, var(--color-text));
}

table button p {
  transition: 0.3s;
  cursor: pointer;
}

table button p:hover {
  font-weight: bolder;
  transition: 0.3s;
}

thead tr {
  background-color: var(--header-color) !important;
}

th {
  padding-inline: calc(var(--spacing) * 6) /* 1.5rem = 24px */;
  padding-block: calc(var(--spacing) * 3) /* 0.75rem = 12px */;
  --tw-font-weight: var(--font-weight-medium) /* 500 */;
  font-weight: var(--font-weight-medium) /* 500 */;
  white-space: nowrap;
}

th[scope='col'] {
  color: var(--color-primary-background);
  text-transform: uppercase;
}

th[scope='row'] {
  color: color-mix(in oklab, var(--color-text) /* var(--color-text) */ 75%, transparent);
  width: 0;
}

td {
  padding-inline: calc(var(--spacing) * 6) /* 1.5rem = 24px */;
  padding-block: calc(var(--spacing) * 4) /* 1rem = 16px */;
}

tr {
  border-bottom-style: var(--tw-border-style);
  border-bottom-width: 1px;
}

tr:nth-of-type(even) {
  background-color: color-mix(
    in oklab,
    var(--color-primary) /* var(--color-text) */ 75%,
    transparent
  );
}

tr:nth-of-type(odd) {
  background-color: color-mix(
    in oklab,
    var(--color-primary-background) /* var(--color-text) */ 50%,
    transparent
  );
}

td button {
  padding: 4px 16px;
  border-radius: 2rem;
  color: var(--color-primary-light);
  font-weight: bold;

  &.edit {
    background-color: var(--color-warn);
  }

  &.delete {
    background-color: var(--color-error);
  }
}
</style>
