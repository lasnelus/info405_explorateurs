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
                <td>{{ enfant.foodConstraint }}</td>
                <td class="text-right" v-if="roleUser.data.role == 'OWNER'">
                  <span>
                    <button @click="gotoChildEdit(enfant.id_enfant)" class="edit">
                      <p>Editer</p>
                    </button>
                    -
                    <button @click="gotoChildDelete(enfant.id_enfant)" class="delete">
                      <p>Supprimer</p>
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
              <th scope="col">ID_repas</th>
              <th scope="col">type</th>
              <th scope="col">nb unit</th>
              <th scope="col">REGIME SPECIAL ?</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(repas, index) in repasDemain" :key="index">
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
// const enfantsDemain = ref([
//   { id_enfant: 'enf001', nom: 'VERSTAPPEN', prenom: 'Max', regime_special: 'non' },
//   { id_enfant: 'enf002', nom: 'HAMILTON', prenom: 'Lewis', regime_special: 'non' },
//   { id_enfant: 'enf003', nom: 'LECLERC', prenom: 'Charles', regime_special: 'non' },
//   { id_enfant: 'enf004', nom: 'NORRIS', prenom: 'Lando', regime_special: 'vegetarien' },
//   { id_enfant: 'enf005', nom: 'RUSSELL', prenom: 'George', regime_special: 'sans_gluten' },
//   { id_enfant: 'enf006', nom: 'ALONSO', prenom: 'Fernando', regime_special: 'non' },
// ])

const repasDemain = ref([
  { id_repas: 'rep101', type: 'Dejeuner', nb_unit: 28, regime_special: 'non' },
  { id_repas: 'rep102', type: 'Vegetarien', nb_unit: 4, regime_special: 'vegetarien' },
  { id_repas: 'rep103', type: 'Sans lactose', nb_unit: 3, regime_special: 'lactose' },
  { id_repas: 'rep104', type: 'Halal', nb_unit: 7, regime_special: 'halal' },
  { id_repas: 'rep105', type: 'Allergie oeuf', nb_unit: 1, regime_special: 'oeuf' },
])

// ---------

import { role } from '@/services/authServices'
import { ref } from 'vue'

const roleUser = await role()

defineProps({
  tomorrowChilds: {
    type: Array,
    required: true,
    default: () => [], // Si la donnée n'arrive pas, on init un tableau vide
  },
})

// TODO
function gotoChildEdit(childID: string) {
  console.log(childID)
}

// TODO
function gotoChildDelete(childID: string) {
  console.log(childID)
}
</script>
