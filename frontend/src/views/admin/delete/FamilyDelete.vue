<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div v-if="family" class="space-y-8">
        <div class="bg-error/25 rounded-lg shadow-lg shadow-error/35 p-8">
          <h1 class="text-3xl font-bold text-error text-center">
            Confirmation de suppression de la famille
          </h1>
        </div>

        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Informations de la famille</h2>

          <div class="grid grid-cols-1 gap-6">
            <div>
              <h3 class="font-semibold mb-2 text-primary">Nom de la famille</h3>
              <p class="text-text/70 text-lg font-bold">{{ family.name }}</p>
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Responsables légaux</h3>
              <ul v-if="family.guardians && family.guardians.length > 0" class="space-y-2">
                <li
                  v-for="guardian in family.guardians"
                  :key="guardian.id"
                  class="text-text/70 bg-primary/10 px-3 py-2 rounded-lg inline-block mr-2"
                >
                  {{ guardian.firstName }} {{ guardian.lastName }}
                </li>
              </ul>
              <p v-else class="text-text/70 italic">Aucun responsable légal assigné.</p>
            </div>
          </div>
        </div>

        <div class="bg-error/25 rounded-lg shadow-lg shadow-error/35 p-8">
          <p class="text-xl font-bold text-error">
            Voulez-vous vraiment supprimer la famille "{{ family.name }}" ?
          </p>

          <span class="m-3 block"></span>

          <div
            v-if="errorMessage"
            class="mb-4 rounded-lg bg-danger/20 border border-danger/30 p-4 text-danger font-semibold"
          >
            {{ errorMessage }}
          </div>

          <p>
            <button
              @click="familyDelete()"
              class="cursor-pointer bg-error p-2 rounded-full text-primary-light font-bold mr-3"
            >
              Supprimer
            </button>
            <button
              @click="gotoAdminDashboard()"
              class="cursor-pointer bg-info p-2 rounded-full text-primary-light font-bold"
            >
              Revenir au panel admin
            </button>
          </p>
        </div>
      </div>

      <div v-else class="text-center text-primary text-xl font-bold mt-20">
        Chargement des données...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { role } from '@/services/authServices'
import { removeFamily, getFamily } from '@/services/familyServices'
import { gotoAdminDashboard } from '@/utils/redirections'

// ----------------
// Type definitions

interface Guardian {
  id: string
  firstName: string
  lastName: string
}

interface Family {
  id: string
  name: string
  guardians: Guardian[]
}

// ----------------
// Const def

const route = useRoute()

const router = useRouter()

const familyId = typeof route.query.familyId === 'string' ? route.query.familyId : ''

const family = ref<Family | null>(null)

const errorMessage = ref<string>('')

const roleUser = await role()

// ----------------
// Fonctions

/**
 * Supprime une famille via l'API
 */
async function familyDelete() {
  errorMessage.value = ''

  try {
    await removeFamily(familyId)
    gotoAdminDashboard()
  } catch (error: unknown) {
    errorMessage.value =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Une erreur est survenue lors de la suppression de la famille.'
  }
}

// ----------------
// On load

onMounted(async () => {
  if (roleUser.data.role !== 'OWNER') {
    router.push('/login')
    return
  }

  if (!familyId) return

  try {
    const res = await getFamily(familyId)
    family.value = res.data as Family
  } catch (error) {
    console.error('Erreur lors de la récupération de la famille :', error)
  }
})
</script>
