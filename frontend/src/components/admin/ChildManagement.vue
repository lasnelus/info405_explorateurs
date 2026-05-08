<template>
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
              <th scope="col">NOM</th>
              <th scope="col">PRENOM</th>
              <th scope="col">REGIME SPECIAL</th>
              <th scope="col">Date de naissance</th>
              <th scope="col" class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="allChilds.length > 0">
              <tr v-for="(enfant, index) in allChilds" :key="index">
                <td>{{ enfant.lastName }}</td>
                <td>{{ enfant.firstName }}</td>
                <td>{{ enfant.foodConstraint == "NONE" ? "N/A" : enfant.foodConstraint }}</td>
                <td>{{ enfant.birthDate.split('T')[0] }}</td>
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
                  Aucun enfant.
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
import { role } from '@/services/authServices'

defineProps({
  allChilds: {
    type: Array,
    required: true,
    default: () => [], // Si la donnée n'arrive pas, on init un tableau vide
  },
})

const roleUser = await role()

// TODO
function newChild() {
  console.log('New child !')
}

// TODO
function gotoChildEdit(childId: string) {
  console.log(childId)
}

// TODO
function gotoChildDelete(childId: string) {
  console.log(childId)
}
</script>
