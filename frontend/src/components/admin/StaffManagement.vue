<template>
  <div class="m-3 mr-6 mb-6">
    <h1 class="text-2xl font-bold mb-6 color-primary">Gestionaire d'animateurs</h1>

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
              <th scope="col">NOM</th>
              <th scope="col">PRENOM</th>
              <th scope="col">GROUPE</th>
              <th scope="col" class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(anim, index) in managers" :key="index">
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
import { role } from '@/services/authServices'
// Test data
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getManager } from '@/services/adminServices'

const router = useRouter()

const managers = ref<Manager[]>([])

const roleUser = await role()


onMounted(async () => {
  await loadManagers()
})

async function loadManagers() {
  try {

    const res = await getManager()
    managers.value = res.data

  } catch (error) {
    console.error('Erreur lors du chargement des managers :', error)
  }
}

// TODO
function newInstructor() {
  console.log('New familly !')
}

// TODO
function gotoInstructorEdit(id_anim: string) {
  console.log("Editing Instructor !", id_anim)
}
</script>
