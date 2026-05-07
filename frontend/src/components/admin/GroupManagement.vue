<!--

  Just got a word that cette page ne peut exister, on as pas de liste de groupes dans la BDD lol
  Ducoup c'est deprecated pour l'instant, et UP TO DELETION.

-->

<template>
  <div class="m-3 mr-6 mb-6">
    <h1 class="text-2xl font-bold mb-6 color-primary">Gestionaire de groupes</h1>

    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">Actions rapides</h2>

      <button
        class="cursor-pointer p-2 bg-primary rounded text-primary-light hover:bg-primary/75 duration-300 mr-3"
        @click="newGroup()"
      >
        Nouveau groupe
      </button>

      <button
        class="cursor-pointer p-2 bg-primary rounded text-primary-light hover:bg-primary/75 duration-300 mr-3"
        @click="emit('switch', 4)"
      >
        Changer un enfant de groupe
      </button>
    </div>

    <!-- Seperateur -->
    <span class="h-6 block"></span>

    <!-- TABLEAU GROUPES -->
    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">Groupes</h2>

      <div class="relative overflow-x-auto bg-primary border-2 border-text/75 rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="border-b border-default">
            <tr>
              <th scope="col">ID_GROUP</th>
              <th scope="col">TITRE</th>
              <th scope="col">COMMENTAIRE</th>
              <th scope="col" class="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(groupe, index) in groupes" :key="index">
              <th scope="row">{{ groupe.id_groupe }}</th>
              <td>{{ groupe.titre }}</td>
              <td>{{ groupe.commentaire }}</td>
              <td class="text-right" v-if="roleUser.data.role == 'OWNER'">
                <span>
                  <button @click="gotoGroupEdit(groupe.id_groupe)" class="edit">
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
    <!-- FIN TABLEAU GROUPES -->
  </div>
</template>

<script setup lang="ts">
import { role } from '@/services/authServices'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Remontée d'evenement au parent (adminMain.vue) pour switch de panel
// Dans notre cas : passer au panel "enfants" (case: 4) pour chercher et modifier le groupe d'un enfant
// switch corresponds a la fonction switch_to de adminMain.vue
const emit = defineEmits(["switch"]);

// Test data
const groupes = ref([
  { id_groupe: 'grp001', titre: 'Les Petits', commentaire: '3-5 ans' },
  { id_groupe: 'grp002', titre: 'Les Moyens', commentaire: '6-8 ans' },
  { id_groupe: 'grp003', titre: 'Les Grands', commentaire: '9-12 ans' },
])

// ---------

const router = useRouter()

const roleUser = await role()

// TODO
function gotoGroupEdit(groupID: string) {
  router.push({
    name: 'groupEdit',
    query: {
      groupID: groupID,
    },
  })
}

// TODO
function newGroup() {
  console.log("New group !")
}
// ---------
</script>
