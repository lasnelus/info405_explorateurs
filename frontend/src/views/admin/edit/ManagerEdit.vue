<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="bg-warn/25 rounded-lg shadow-lg shadow-warn/35 p-8 mb-8">
        <h1 class="text-3xl font-bold text-warn text-center">
          Édition du manager {{ manager ? `- ${manager.firstName} ${manager.lastName}` : '' }}
        </h1>
      </div>

      <div v-if="manager">
        <form @submit.prevent="submitManagerUpdate" class="pt-8">
          <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
            <h2 class="text-2xl font-bold mb-6 text-primary">Informations Personnelles</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="font-semibold mb-2 text-primary">Prénom</h3>
                <input
                  v-model="editedManager.firstName"
                  type="text"
                  class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <div>
                <h3 class="font-semibold mb-2 text-primary">Nom</h3>
                <input
                  v-model="editedManager.lastName"
                  type="text"
                  class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <div class="md:col-span-2">
                <h3 class="font-semibold mb-2 text-primary">Email</h3>
                <input
                  v-model="editedManager.email"
                  type="email"
                  class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
            </div>
          </div>

          <div class="bg-success/25 rounded-lg shadow-lg shadow-success/35 p-8">
            <p class="text-xl font-bold text-success">
              Voulez-vous sauvegarder les modifications pour {{ editedManager.firstName }}
              {{ editedManager.lastName }} ?
            </p>

            <span class="m-3 block"></span>

            <div class="flex gap-4">
              <button
                type="submit"
                class="cursor-pointer bg-success p-3 rounded-full text-primary-light font-bold"
              >
                Mettre à jour le manager
              </button>
              <button
                type="button"
                @click="gotoAdminDashboard"
                class="cursor-pointer bg-info p-3 rounded-full text-primary-light font-bold"
              >
                Revenir au panel admin
              </button>
            </div>
            <p v-if="errorMessage" class="text-error font-bold mt-4">{{ errorMessage }}</p>
          </div>
        </form>
      </div>

      <div v-else class="text-center text-primary text-xl font-bold mt-20">
        Chargement des données...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { role } from '@/services/authServices'
import { getManagerbyId, patchManager } from '@/services/adminServices'
import { gotoAdminDashboard } from '@/utils/redirections'

// ----------------
// Type definitions

interface Manager {
  id: string
  email: string
  firstName: string
  lastName: string
}

// ----------------
// Const def

// Route (pour query)
const route = useRoute()

// Routeur
const router = useRouter()

// Role de l'utilisateur courant
const roleUser = await role()

// Id du manager récup via query
const managerId = Array.isArray(route.query.managerId)
  ? route.query.managerId[0]
  : route.query.managerId

// Manager a modifier
const manager = ref<Manager | null>(null)

// Message d'erreur
const errorMessage = ref('')

// Brouillon du manager modifié
const editedManager = reactive({
  email: '',
  firstName: '',
  lastName: '',
})

// ----------------
// Fonctions

async function submitManagerUpdate() {
  errorMessage.value = ''

  try {
    if (!managerId) return

    await patchManager(
      managerId as string,
      editedManager.email,
      editedManager.firstName,
      editedManager.lastName,
    )

    gotoAdminDashboard()
  } catch (error: unknown) {
    errorMessage.value =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Une erreur est survenue lors de la modification du manager'
  }
}

// ----------------
// On load

onMounted(async () => {
  if (roleUser.data.role !== 'OWNER') {
    router.push('/login')
    return
  }

  if (!managerId) return

  try {
    const res = await getManagerbyId(managerId as string)
    manager.value = res.data as Manager

    editedManager.email = res.data.email
    editedManager.firstName = res.data.firstName
    editedManager.lastName = res.data.lastName
  } catch (error) {
    console.error('Erreur lors de la récupération du manager :', error)
  }
})
</script>
