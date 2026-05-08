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
              <th scope="col">titre</th>
              <th scope="col">description</th>
              <th scope="col">Tranche d'age</th>
              <th scope="col">Debut</th>
              <th scope="col">Fin</th>
              <th scope="col">Capacitée</th>
              <th scope="col" class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="allActivities.length > 0">
              <tr v-for="(activite, index) in allActivities" :key="index">
                <td>{{ activite.title != '' ? 'N/A' : activite.title }}</td>
                <td>{{ activite.description != '' ? 'N/A' : activite.description }}</td>
                <td>{{ activite.ageMin }} - {{ activite.ageMax }} ans</td>
                <td>{{ activite.firstDay.split('T')[0] }}</td>
                <td>{{ activite.lastDay.split('T')[0] }}</td>
                <td>{{ activite.capacity }}</td>
                <td class="text-right">
                  <span>
                    <button @click="gotoActivityEdit(activite.id)" class="edit">
                      <p>Editer</p>
                    </button>
                  </span>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="10" class="p-8 text-center text-text font-medium italic">
                  Aucune activité...
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <!-- FIN TABLEAU ACTIVITES -->
  </div>
</template>

<script setup lang="ts">

defineProps({
  allActivities: {
    type: Array,
    required: true,
    default: () => [], // Si la donnée n'arrive pas, on init un tableau vide
  },
})

// TODO
// NOTE : Accessible aux animateurs
function gotoActivityEdit(activityID: string) {
  console.log(activityID)
}

// TODO
// NOTE : Accessible aux animateurs
function newActivity() {
  console.log('New activity !')
}
</script>
