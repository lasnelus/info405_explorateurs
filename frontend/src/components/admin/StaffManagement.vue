<template>
  <p>

    Tableau des animateurs : ID_ANIM | nom | prenom | groupe | est_present_aujourd_hui | modif/supr

  </p>
  <div class="m-3 mr-6 mb-6">
    <h1 class="text-2xl font-bold mb-6 color-primary">Gestionaire d'animateurs'</h1>

    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">Action rapide</h2>

      <button
        class="cursor-pointer p-2 bg-primary rounded text-primary-light hover:bg-primary/75 duration-300 mr-3"
        @click="newInstructor()"
      >
        Nouvel animateur
      </button>
    </div>

    <!-- Separateur -->
    <span class="h-6 block"></span>

    <!-- TAB ANIMATEURS -->
    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">Animateurs</h2>

      <div class="relative overflow-x-auto bg-primary border-2 border-text/75 rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="border-b border-default">
            <tr>
              <th scope="col">ID_ANIMATEUR</th>
              <th scope="col">NOM</th>
              <th scope="col">PRENOM</th>
              <th scope="col">GROUPE</th>
              <th scope="col" class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(anim, index) in animateurs" :key="index">
              <th scope="row">{{ anim.id_anim }}</th>
              <td>{{ anim.nom }}</td>
              <td>{{ anim.prenom }}</td>
              <td>{{ anim.groupe }}</td>
              <td class="text-right" v-if="roleUser.data.role == 'OWNER'">
                <span>
                  <button @click="gotoInstructorEdit(anim.id_anim)" class="edit">
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
const animateurs = ref([
  { id_anim: "anim001", nom: "DUPONT", prenom: "Marie", groupe: "Les Petits", est_present_aujourd_hui: true },
  { id_anim: "anim002", nom: "MARTIN", prenom: "Lucas", groupe: "Les Moyens", est_present_aujourd_hui: true },
  { id_anim: "anim003", nom: "BERNARD", prenom: "Emma", groupe: "Les Grands", est_present_aujourd_hui: false },
  { id_anim: "anim004", nom: "THOMAS", prenom: "Hugo", groupe: "Les Petits", est_present_aujourd_hui: true },
  { id_anim: "anim005", nom: "ROBERT", prenom: "Chloé", groupe: "Les Moyens", est_present_aujourd_hui: false },
])

// ---------

import { role } from '@/services/authServices'
import { ref } from 'vue'

const roleUser = await role()

// TODO
function newInstructor() {
  console.log('New familly !')
}

// TODO
function gotoInstructorEdit() {
  console.log("Editing Instructor !")
}
</script>
