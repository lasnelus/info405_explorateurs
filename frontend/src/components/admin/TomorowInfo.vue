<template>
  <div class="m-3 mr-6 mb-6">
    <h1 class="text-2xl font-bold mb-6 color-primary">Demain</h1>

    <!-- ENFANTS ATTENDUS -->
    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">Enfants attendus</h2>

      <div class="relative overflow-x-auto bg-primary border-2 border-text/75 rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="border-b border-default">
            <tr>
              <th scope="col">NOM</th>
              <th scope="col">PRENOM</th>
              <th scope="col">REGIME SPECIAL ?</th>
              <th scope="col" class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="tomorrowChilds.length > 0">
              <tr v-for="(enfant, index) in tomorrowChilds" :key="index">
                <td>{{ enfant.lastName }}</td>
                <td>{{ enfant.firstName }}</td>
                <td>{{ enfant.foodConstraint == 'NONE' ? 'NON' : enfant.foodConstraint }}</td>
                <td class="text-right" v-if="roleUser.data.role == 'OWNER'">
                  <span>
                    <button @click="gotoChildEdit(enfant.id)" class="edit">
                      <p>Editer</p>
                    </button>
                  </span>
                </td>
                <td class="text-right" v-else>N/A</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="6" class="p-8 text-center text-text font-medium italic">
                  Aucun enfant n'est présent pour cette date.
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Separateur -->
    <span class="h-20 block"></span>

    <!-- REPAS DU JOUR -->
    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">repas prévus</h2>
      <div class="relative overflow-x-auto bg-primary border-2 border-text/75 rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="border-b border-default">
            <tr>
              <th scope="col">type</th>
              <th scope="col">nb unit</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="repasDemain.length > 0">
              <tr v-for="(repas, index) in repasDemain" :key="index">
                <td>{{ repas.label }}</td>
                <td>{{ repas.nb_unit }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="6" class="p-8 text-center text-text font-medium italic">
                  Aucun repas n'est prévu pour cette date.
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'

import { role } from '@/services/authServices'
import { calcFoodList, filterFoodList } from '@/utils/foodCalc'
import { computed } from 'vue'


// ----------------
// Type definitions

interface slots {
  id: string
  date: string
  id_repas: string
}

interface Child {
  id: string
  firstName: string
  lastName: string
  foodConstraint: string
  slots: slots[]
}
// ----------------
// Const def

const roleUser = await role()

// ----------------
// Props (provenance: src/view/admin/adminMain.vue)
const props = defineProps<{
  tomorrowChilds: Child[]
}>()

const repasDemain = computed(() => {
  return filterFoodList(calcFoodList(props.tomorrowChilds))
})

// ---------------------------------------
// CRUD
// NOTE: Pas de la gestion d'enfants, alors inutile de mettre bien plus d'informations

/**
 * Renvoie sur la page d'edition d'un enfant
 */
function gotoChildEdit(childID: string) {
  router.push({
    name: 'childEdit',
    query: {
      childId: childID,
    },
  })
}
</script>
