<template>
  <div class="min-h-screen bg-background">
    <!-- Placement du titre cohérent avec les autres pages -->
    <div class="max-w-4xl mx-auto px-6 pt-12 pb-6">
        <h2 class="text-2xl font-bold mb-6 color-primary">Page d'administration</h2>
    </div>

    <!--  -->
    <div class="
    w-full mx-auto px-6
    flex flex-row
    ">

      <!-- Panneau latéral -->
      <div class="
      w-3xs mt-6 pl-3 py-3
      rounded-l-xl
      bg-primary/25
      ">
        <!-- Aujourd'hui (default) -->
        <div class="mt-auto">
          <button
          @click="switch_to(0)"
          class="
          activeButton

          btn-side-panel

          rounded-tl-[6px]
          "
          >
            Aujourd'hui
          </button>

          <!-- Demain/Semaine (owner) -->
          <button
          @click="switch_to(1)"
          class="

          btn-side-panel
          "
          >
            Demain
          </button>

          <!-- Activitées -->
          <button
          @click="switch_to(2)"
          class="

          btn-side-panel
          "
          >
            Activitées
          </button>

          <!-- Groupes -->
          <button
          @click="switch_to(3)"
          class="

          btn-side-panel
          "
          >
            Groupes
          </button>

          <!-- Enfants -->
          <button
          @click="switch_to(4)"
          class="

          btn-side-panel
          "
          >
            Enfants
          </button>

          <!-- Familles -->
          <button
          @click="switch_to(5)"
          class="

          btn-side-panel
          "
          >
            Familles
          </button>

          <!-- Animateurs -->
          <button
          @click="switch_to(6)"
          class="

          btn-side-panel

          rounded-bl-[6px]
          "
          >
            Animateurs
          </button>
        </div>
      </div>

      <div class="
      w-full h-auto pl-3
      rounded-r-xl
      rounded-tl-xl
      bg-primary/25
      ">


      </div>

    <!--  -->


    </div>
  </div>

</template>

<style>
    .activeButton {
      background-color: color-mix(in oklab, var(--color-primary-100) /* var(--color-primary) */ 50%, transparent);
    }
</style>

<script setup lang="ts">

import router from '@/router'
import { role } from '@/services/authServices'
import { onMounted } from 'vue'

const roleUser = await role()

onMounted(async () =>{
  // Les utilisateurs "normaux" n'ont pas à acceder a cette page. Redirection sur /login
  if(roleUser.data.role != "OWNER" && roleUser.data.role != "INSTRUCTOR"){
    router.push('/login')
  }
})


function switch_to(pannel: number) {
  
}

</script>

<style scoped>

@layer components {
  .btn-side-panel {
    display: block;
    width: 100%;
    padding-block: calc(var(--spacing) * 2);

    background-color: color-mix(in oklab, var(--color-primary) /* var(--color-secondary-100) */ 50%, transparent);
    color: var(--color-text) /* var(--color-primary-background) */;

    text-align: center;

    border-right: 4px solid var(--color-primary);

    --tw-font-weight: var(--font-weight-semibold) /* 600 */;
    font-weight: var(--font-weight-semibold) /* 600 */;

    cursor: pointer;

    transition-property: all;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function) /* cubic-bezier(0.4, 0, 0.2, 1) */);
    transition-duration: var(--tw-duration, var(--default-transition-duration) /* 150ms */);

    &:hover {
        @media (hover: hover) {
            background-color: var(--color-primary) /* var(--color-secondary-100) */;
        }
    }
  }
}

</style>
