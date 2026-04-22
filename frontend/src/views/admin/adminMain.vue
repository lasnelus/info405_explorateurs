<template>
  <div class="min-h-screen bg-background">
    <!-- Placement du titre cohérent avec les autres pages -->
    <div class="max-w-4xl mx-auto px-6 pt-12 pb-6">
      <h2 class="text-2xl font-bold mb-6 color-primary">Page d'administration</h2>
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
            class="activeButton btn-side-panel rounded-tl-[6px]"
          >
            Aujourd'hui
          </button>

          <!-- Demain/Semaine (owner) -->
          <button @click="switch_to(1)" id="Demain" class="btn-side-panel">Demain</button>

          <!-- Activitées -->
          <button @click="switch_to(2)" id="Activitees" class="btn-side-panel">Activitées</button>

          <!-- Groupes -->
          <button @click="switch_to(3)" id="Groupes" class="btn-side-panel">Groupes</button>

          <!-- Enfants -->
          <button @click="switch_to(4)" id="Enfants" class="btn-side-panel">Enfants</button>

          <!-- Familles -->
          <button @click="switch_to(5)" id="Familles" class="btn-side-panel">Familles</button>

          <!-- Animateurs -->
          <button @click="switch_to(6)" id="Animateurs" class="btn-side-panel rounded-bl-[6px]">
            Animateurs
          </button>
        </div>
      </div>

      <div
        id="componentContainer"
        class="w-full h-fit pl-3 rounded-xl bg-primary/25 inline-block"
      >
        <component :is="currentComponent" />
      </div>

      <!--  -->
    </div>
  </div>
</template>

<script setup lang="ts">
import TodayInfo from '@/components/admin/TodayInfo.vue'
import TomorowInfo from '@/components/admin/TomorowInfo.vue'
import ActivityManagement from '@/components/admin/ActivityManagement.vue'
import FamilyManagement from '@/components/admin/FamilyManagement.vue'
import GroupManagement from '@/components/admin/GroupManagement.vue'
import StaffManagement from '@/components/admin/StaffManagement.vue'
import ChildManagement from '@/components/admin/ChildManagement.vue'

import router from '@/router'
import { role } from '@/services/authServices'
import { onMounted } from 'vue'
import { ref } from 'vue'

const roleUser = await role()

onMounted(async () => {
  // Les utilisateurs "normaux" n'ont pas à acceder a cette page. Redirection sur /login
  if (roleUser.data.role != 'OWNER' && roleUser.data.role != 'INSTRUCTOR') {
    router.push('/login')
  }
})

// Component stuff

const currentComponent = ref(TodayInfo)

function switch_to(pannel: number) {
  const button = document.querySelector('.activeButton')
  button?.classList.remove('activeButton')

  switch (pannel) {
    case 0:
      document.querySelector('#Aujourdhui')?.classList.add('activeButton')
      currentComponent.value = TodayInfo
      break

    case 1:
      document.querySelector('#Demain')?.classList.add('activeButton')
      currentComponent.value = TomorowInfo
      break

    // Activitees
    case 2:
      document.querySelector('#Activitees')?.classList.add('activeButton')
      currentComponent.value = ActivityManagement
      break

    // Groupes
    case 3:
      document.querySelector('#Groupes')?.classList.add('activeButton')
      currentComponent.value = GroupManagement
      break

    // Enfants
    case 4:
      document.querySelector('#Enfants')?.classList.add('activeButton')
      currentComponent.value = ChildManagement
      break

    // Familles
    case 5:
      document.querySelector('#Familles')?.classList.add('activeButton')
      currentComponent.value = FamilyManagement
      break

    // Animateurs
    case 6:
      document.querySelector('#Animateurs')?.classList.add('activeButton')
      currentComponent.value = StaffManagement
      break

    default:
      break
  }
}
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
  --header-color: color-mix(in oklab, var(--color-primary) 50%, var(--color-text)) ;
}

table a {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  transition: .3s;
}

table a:hover {
  font-weight: bolder;
  transition: .3s;
}

thead tr{
  background-color: var(--header-color) !important;
}

th {
  padding-inline: calc(var(--spacing) * 6) /* 1.5rem = 24px */;
  padding-block: calc(var(--spacing) * 3) /* 0.75rem = 12px */;
  --tw-font-weight: var(--font-weight-medium) /* 500 */;
  font-weight: var(--font-weight-medium) /* 500 */;
  white-space: nowrap;
}

th[scope="col"] {
  color: var(--color-primary-background);
}

th[scope="row"] {
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
  background-color: color-mix(in oklab, var(--color-primary) /* var(--color-text) */ 75%, transparent);
}

tr:nth-of-type(odd) {
  background-color: color-mix(in oklab, var(--color-primary-background) /* var(--color-text) */ 50%, transparent);
}

</style>
