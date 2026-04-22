<template>
  <div class="m-3 mr-6">
    <h1 class="text-2xl font-bold mb-6 color-primary">
      Demain
    </h1>

    <p>
      (bouton) Ajouter une activité
    </p>

    <!-- activités -->
    <div>

      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">
        Activités
      </h2>

      <div class="relative overflow-x-auto bg-primary border-2 border-text/75 rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-body">
              <thead class="border-b border-default">
                  <tr>
                      <th scope="col">
                          ID_activité
                      </th>
                      <th scope="col">
                          titre
                      </th>
                      <th scope="col">
                          description
                      </th>
                      <th scope="col" class="text-right">
                          Actions
                      </th>
                  </tr>
              </thead>
              <tbody>
                <tr v-for="(activite, index) in activites" :key="index">
                  <th scope="row">{{ activite.id_activite }}</th>
                  <td>{{ activite.titre }}</td>
                  <td>{{ activite.desc }}</td>
                  <td class="text-right">
                    <span>
                      <button
                      @click="gotoActivityEdit(activite.id_activite)"
                      >
                        <p>Editer</p>
                      </button>
                    </span>
                  </td>
                </tr>
              </tbody>
          </table>
      </div>
    </div>

    <!-- Separateur -->
    <span class="h-20 block"></span>


  </div>
</template>

<script setup lang="ts">

// Test data
const activites = ref([
  { id_activite: "act001", titre: "Peinture", desc: "Atelier créatif avec peinture" },
  { id_activite: "act002", titre: "Football", desc: "Match en extérieur" },
  { id_activite: "act003", titre: "Lecture", desc: "Temps calme bibliothèque" },
  { id_activite: "act004", titre: "Danse", desc: "Chorégraphie en groupe" },
  { id_activite: "act005", titre: "Jeux de société", desc: "Activité intérieure" },
])

// ---------

import { ref } from 'vue'

// TODO
function gotoActivityEdit(activityID: string) {
  console.log(activityID);
};

</script>
