<template>
  <!-- <div class="m-3 mr-6 mb-6">
    <h1>CHILD MANAGEMENT</h1>

    <p>Ajouter un enfant</p>

    <p>
      Tableau des enfants : ID_ENFANT | nom | prenom | groupe | voir_enfant/modif/supr <br />
       <br />
      Searchbar
    </p>
  </div> -->
  <div class="m-3 mr-6 mb-6">
    <h1 class="text-2xl font-bold mb-6 color-primary">Gestionaire d'enfants</h1>

    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">Action rapide</h2>

      <button
        class="cursor-pointer p-2 bg-primary rounded text-primary-light hover:bg-primary/75 duration-300 mr-3"
        @click="newChild()"
      >
        Creer un enfant
      </button>
    </div>

    <!-- Separateur -->
    <span class="h-6 block"></span>

    <!-- TAB ENFANTS -->
    <div>
      <!-- TODO : FILTRES -->
       <!-- Filtres : groupe, age, famille/, ordre_alphabetique -->
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">Enfants du centre</h2>

      <div class="relative overflow-x-auto bg-primary border-2 border-text/75 rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="border-b border-default">
            <tr>
              <th scope="col">ID_ENFANT</th>
              <th scope="col">NOM</th>
              <th scope="col">PRENOM</th>
              <th scope="col">GROUPE</th>
              <th scope="col" class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(enfant, index) in enfantsGroupes" :key="index">
              <th scope="row">{{ enfant.id_enfant }}</th>
              <td>{{ enfant.nom }}</td>
              <td>{{ enfant.prenom }}</td>
              <td>{{ enfant.titre_groupe }}</td>
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
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Test data
const enfantsGroupes = ref([
  {
    id_enfant: 'enf001',
    nom: 'VERSTAPPEN',
    prenom: 'Max',
    id_groupe: 'grp003',
    titre_groupe: 'Les Grands',
  },
  {
    id_enfant: 'enf002',
    nom: 'HAMILTON',
    prenom: 'Lewis',
    id_groupe: 'grp003',
    titre_groupe: 'Les Grands',
  },
  {
    id_enfant: 'enf003',
    nom: 'LECLERC',
    prenom: 'Charles',
    id_groupe: 'grp002',
    titre_groupe: 'Les Moyens',
  },
  {
    id_enfant: 'enf004',
    nom: 'NORRIS',
    prenom: 'Lando',
    id_groupe: 'grp002',
    titre_groupe: 'Les Moyens',
  },
  {
    id_enfant: 'enf005',
    nom: 'RUSSELL',
    prenom: 'George',
    id_groupe: 'grp001',
    titre_groupe: 'Les Petits',
  },
  {
    id_enfant: 'enf006',
    nom: 'ALONSO',
    prenom: 'Fernando',
    id_groupe: 'grp003',
    titre_groupe: 'Les Grands',
  },
])

// ---------

import { role } from '@/services/authServices'
import { ref } from 'vue'

const roleUser = await role()

// TODO
function newChild() {
  console.log("New child !");
}
</script>
