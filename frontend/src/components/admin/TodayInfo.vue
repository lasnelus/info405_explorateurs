<template>
  <div class="m-3 mr-6 mb-6">
    <h1 class="text-2xl font-bold mb-6 color-primary">Aujourd'hui</h1>

    <!-- ENFANTS PRESENTS -->
    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">Enfants présents</h2>

      <div class="relative overflow-x-auto bg-primary border-2 border-text/75 rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="border-b border-default">
            <tr>
              <th scope="col">NOM</th>
              <th scope="col">PRENOM</th>
              <th scope="col">REGIME SPECIAL ?</th>
              <th scope="col">PRESENT ?</th>
              <th scope="col" class="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="todayChilds.length > 0">
              <tr v-for="(enfant, index) in todayChilds" :key="index">
                <td>{{ enfant.lastName }}</td>
                <td>{{ enfant.firstName }}</td>
                <td>{{ enfant.foodConstraint == "NONE" ? "N/A" : enfant.foodConstraint }}</td>

                <!-- TODO: UPDATE SERVEUR QUAND CHECKBOX -->
                <td class="p-0!">
                  <label class="flex justify-center items-center cursor-pointer w-1/2">
                    <input type="checkbox" v-model="enfant.present" class="sr-only peer" />
                    <div
                      class="w-10 h-10 flex items-center justify-center bg-(--header-color) rounded border border-text peer-checked:bg-success"
                    >
                      <svg
                        class="w-7 h-7 text-white opacity-0 transition"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        viewBox="0 0 24 24"
                        :class="{ 'opacity-100': enfant.present }"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </label>
                </td>
                <td class="text-right" v-if="roleUser.data.role == 'OWNER'">
                  <span>
                    <button @click="gotoChildEdit(enfant.id)" class="edit">
                      <p>Editer un enfant</p>
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
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">repas du jour</h2>
      <div class="relative overflow-x-auto bg-primary border-2 border-text/75 rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="border-b border-default">
            <tr>
              <th scope="col">ID_repas</th>
              <th scope="col">type</th>
              <th scope="col">nb unit</th>
              <th scope="col">REGIME SPECIAL ?</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(repas, index) in repasAujourdhui" :key="index">
              <th scope="row">{{ repas.id_repas }}</th>
              <td>{{ repas.type }}</td>
              <td>{{ repas.nb_unit }}</td>
              <td>{{ repas.regime_special }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Test data
// const enfantsAujourdhui = ref([
//   { id_enfant: 'enf001', nom: 'VERSTAPPEN', prenom: 'Max', regime_special: 'non', present: true },
//   { id_enfant: 'enf002', nom: 'HAMILTON', prenom: 'Lewis', regime_special: 'non', present: true },
//   { id_enfant: 'enf003', nom: 'LECLERC', prenom: 'Charles', regime_special: 'non', present: false },
//   {
//     id_enfant: 'enf004',
//     nom: 'NORRIS',
//     prenom: 'Lando',
//     regime_special: 'vegetarien',
//     present: true,
//   },
//   {
//     id_enfant: 'enf005',
//     nom: 'RUSSELL',
//     prenom: 'George',
//     regime_special: 'sans_gluten',
//     present: true,
//   },
//   { id_enfant: 'enf006', nom: 'ALONSO', prenom: 'Fernando', regime_special: 'non', present: false },
// ])

const repasAujourdhui = ref([
  { id_repas: 'rep001', type: 'Dejeuner', nb_unit: 25, regime_special: 'non' },
  { id_repas: 'rep002', type: 'Vegetarien', nb_unit: 5, regime_special: 'vegetarien' },
  { id_repas: 'rep003', type: 'Sans gluten', nb_unit: 2, regime_special: 'sans_gluten' },
  { id_repas: 'rep004', type: 'Allergie arachide', nb_unit: 1, regime_special: 'arachide' },
  { id_repas: 'rep005', type: 'Halal', nb_unit: 6, regime_special: 'halal' },
])

// ---------

import { role } from '@/services/authServices'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const roleUser = await role()

defineProps({
  todayChilds: {
    type: Array,
    required: true,
    default: () => [], // Si la donnée n'arrive pas, on init un tableau vide
  },
})

// TODO
function gotoChildEdit(childID: string) {
  router.push({
    name: 'childEdit',
    query: {
      childId: childID,
    },
  })
}
</script>
