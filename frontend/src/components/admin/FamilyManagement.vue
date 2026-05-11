<template>
  <div class="m-3 mr-6 mb-6">
    <h1 class="text-2xl font-bold mb-6 color-primary">
      Gestionaire de familles
    </h1>

    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">
        Action rapide
      </h2>

      <button
        class="cursor-pointer p-2 bg-primary rounded text-primary-light hover:bg-primary/75 duration-300 mr-3"
        @click="newFamilly()"
      >
        Créer une famille
      </button>
    </div>

    <!-- Séparateur -->
    <span class="h-6 block"></span>

    <!-- TABLE FAMILLES -->
    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">
        Familles
      </h2>

      <div
        class="relative overflow-x-auto bg-primary border-2 border-text/75 rounded-lg"
      >
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="border-b border-default">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">NOM</th>
              <th scope="col" class="text-right">Actions</th>
            </tr>
          </thead>

          <tbody v-if="familles.length > 0">
            <tr
              v-for="(famille, index) in familles"
              :key="index"
            >
              <th scope="row">
                {{ famille.id }}
              </th>

              <td>
                {{ famille.name }}
              </td>

              <td
                class="text-right"
                v-if="roleUser.data.role == 'OWNER'"
              >
                <span>
                  <button
                    @click="gotoFamillyEdit(famille.id)"
                    class="edit"
                  >
                    <p>Editer</p>
                  </button>
                </span> -
                <span>
                  <button
                    @click="gotoFamillyDelete(famille.id)"
                    class="delete"
                  >
                    <p>Supprimer</p>
                  </button>
                </span>
              </td>

              <td class="text-right" v-else>
                N/A
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr>
              <td
                colspan="3"
                class="text-center py-6 text-text italic"
              >
                Aucune famille trouvée
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { role } from '@/services/authServices'
import { getFamilies } from '@/services/familyServices'
import { useRouter } from 'vue-router'

const router = useRouter()
const roleUser = await role()

interface Family {
  id: string
  name: string
}

const familles = ref<Family[]>([])

onMounted(async () => {
  await loadFamilies()
})

async function loadFamilies() {
  try {

    const res = await getFamilies()
    familles.value = res.data

  } catch (error) {
    console.error('Erreur lors du chargement des familles :', error)
  }
}

function newFamilly() {
  router.push('familyCreate')
}

function gotoFamillyEdit(familyId: string) {
  router.push({
    name: 'familyEdit',
    query: {
      familyId: familyId,
    },
  })
}

function gotoFamillyDelete(familyId: string) {
  router.push({
    name: 'familyDelete',
    query: {
      familyId: familyId
    },
  })
}

</script>
