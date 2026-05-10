<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="bg-success/25 rounded-lg shadow-lg shadow-success/35 p-8">
        <h1 class="text-3xl font-bold text-success text-center">
          Création d'une famille
        </h1>
      </div>

      <form @submit.prevent="createNewFamily" class="pt-8">
        <!-- Informations famille -->
        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">
            Informations de la famille
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nom -->
            <div>
              <h3 class="font-semibold mb-2 text-primary">Nom de la famille</h3>
              <input
                v-model="newFamily.name"
                type="text"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="MALABRE"
                required
              />
            </div>

            <!-- Guardian -->
            <div>
              <h3 class="font-semibold mb-2 text-primary">
                Responsable légal
              </h3>

              <select
                v-model="newFamily.guardianId"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              >
                <option disabled value="">Sélectionner un guardian</option>

                <option
                  v-for="guardian in guardians"
                  :key="guardian.id"
                  :value="guardian.id"
                >
                  {{ guardian.firstName }} {{ guardian.lastName }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Confirmation -->
        <div class="bg-success/25 rounded-lg shadow-lg shadow-success/35 p-8">
          <p class="text-xl font-bold text-success">
            Voulez-vous vraiment ajouter la famille
            {{ newFamily.name }} ?
          </p>

          <span class="m-3"></span>

          <p>
            <button
              type="submit"
              class="cursor-pointer bg-success p-3 rounded-full text-primary-light font-bold mr-3"
            >
              Créer une famille
            </button>

            <button
              type="button"
              @click="gotoAdminDashboard"
              class="cursor-pointer bg-info p-3 rounded-full text-primary-light font-bold"
            >
              Revenir au panel admin
            </button>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { role } from '@/services/authServices'
import { getGuardian } from '@/services/guardianService'
import { createFamily } from '@/services/familyServices'

interface Guardian {
  id: string
  firstName: string
  lastName: string
}

interface NewFamily {
  name: string
  guardianId: string
}

const router = useRouter()

const guardians = ref<Guardian[]>([])

const roleUser = await role()

const newFamily = reactive<NewFamily>({
  name: '',
  guardianId: '',
})

async function createNewFamily() {
  try {
    await createFamily(
      newFamily.name,
      newFamily.guardianId,
    )
    router.push('/admin')
  } catch (error: unknown) {
    console.error(
      'Erreur lors de la création de la famille :',
      error,
    )
  }
}


function gotoAdminDashboard() {
  router.push('/admin')
}

onMounted(async () => {

  if (roleUser.data.role !== 'OWNER') {
    router.push('/login')
    return
  }

  try {
    const response = await getGuardian()
    guardians.value = response.data as Guardian[]
  } catch (error: unknown) {
    console.error(
      'Erreur lors du chargement des guardians :',
      error,
    )
  }
})
</script>
