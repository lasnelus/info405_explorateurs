<template>
  <div class="m-3 mr-6 mb-6">
    <h1 class="text-2xl font-bold mb-6 color-primary">Gestionaire de familles</h1>

    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">Action rapide</h2>

      <button
        class="cursor-pointer p-2 bg-primary rounded text-primary-light hover:bg-primary/75 duration-300 mr-3"
        @click="newFamilly()"
      >
        Créer une famille
      </button>
    </div>

    <!-- Separateur -->
    <span class="h-6 block"></span>

    <!-- TAB FAMILLES -->
    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">Familles</h2>

      <div class="relative overflow-x-auto bg-primary border-2 border-text/75 rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="border-b border-default">
            <tr>
              <th scope="col">ID_FAMILLE</th>
              <th scope="col">NOM</th>
              <th scope="col">NB ENFANTS</th>
              <th scope="col" class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(famille, index) in familles" :key="index">
              <th scope="row">{{ famille.id_famille }}</th>
              <td>{{ famille.nom }}</td>
              <td>{{ famille.nb_enfants }}</td>
              <td class="text-right" v-if="roleUser.data.role == 'OWNER'">
                <span>
                  <button @click="gotoFamillyEdit(famille.id_famille)" class="edit">
                    <p>Editer</p>
                  </button>
                </span>
              </td>
              <td class="text-right" v-else>N/A</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Test data
const familles = ref([
  { id_famille: 'fam001', nom: 'VERSTAPPEN', nb_enfants: 1 },
  { id_famille: 'fam002', nom: 'HAMILTON', nb_enfants: 2 },
  { id_famille: 'fam003', nom: 'LECLERC', nb_enfants: 1 },
  { id_famille: 'fam004', nom: 'NORRIS', nb_enfants: 3 },
  { id_famille: 'fam005', nom: 'RUSSELL', nb_enfants: 1 },
])

// ---------

import { role } from '@/services/authServices'
import { ref } from 'vue'

const roleUser = await role()

// TODO
function newFamilly() {
  console.log('New familly !');
}

// TODO
function gotoFamillyEdit(familly_ID: string) {
  console.log(familly_ID);
}
</script>
