<template>
  <div class="m-3 mr-6 mb-6">
    <h1 class="text-2xl font-bold mb-6 color-primary">Gestionaire d'activités</h1>

    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">Action rapide</h2>

      <button
        class="cursor-pointer p-2 bg-primary rounded text-primary-light hover:bg-primary/75 duration-300"
        @click="newActivity()"
      >
        Ajouter une activité
      </button>
    </div>

    <!-- Seperateur -->
    <span class="h-6 block"></span>

    <!-- TABLEAU ACTIVITES -->
    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">Activités</h2>

      <div class="relative overflow-x-auto bg-primary border-2 border-text/75 rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="border-b border-default">
            <tr>
              <th scope="col">ID_activité</th>
              <th scope="col">titre</th>
              <th scope="col">description</th>
              <th scope="col" class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(activite, index) in activites" :key="index">
              <th scope="row">{{ activite.id_activite }}</th>
              <td>{{ activite.titre }}</td>
              <td>{{ activite.desc }}</td>
              <td class="text-right">
                <span>
                  <button @click="gotoActivityEdit(activite.id_activite)" class="edit">
                    <p>Editer</p>
                  </button>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- FIN TABLEAU ACTIVITES -->
  </div>
</template>

<script setup lang="ts">
// Test data
const activites = ref([
  { id_activite: 'act001', titre: 'Peinture', desc: 'Atelier créatif avec peinture' },
  { id_activite: 'act002', titre: 'Football', desc: 'Match en extérieur' },
  { id_activite: 'act003', titre: 'Lecture', desc: 'Temps calme bibliothèque' },
  { id_activite: 'act004', titre: 'Danse', desc: 'Chorégraphie en groupe' },
  { id_activite: 'act005', titre: 'Jeux de société', desc: 'Activité intérieure' },
])

// ---------

import { ref } from 'vue'

// TODO
// NOTE : Accessible aux animateurs & a la direction.
function gotoActivityEdit(activityID: string) {
  console.log(activityID)
}

// TODO
function newActivity() {
  console.log("New activity !")
}
</script>
