<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div v-if="activity" class="space-y-8">
        <div class="bg-error/25 rounded-lg shadow-lg shadow-error/35 p-8">
          <h1 class="text-3xl font-bold text-error text-center">
            Confirmation de supression de l'activité
          </h1>
        </div>

        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Informations de l'activité</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold mb-2 text-primary">Titre</h3>
              <p class="text-text/70">{{ activity.title }}</p>
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Description</h3>
              <p class="text-text/70">{{ activity.description }}</p>
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Âge minimum</h3>
              <p class="text-text/70">{{ activity.ageMin }}</p>
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Âge maximum</h3>
              <p class="text-text/70">{{ activity.ageMax }}</p>
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Capacité</h3>
              <p class="text-text/70">{{ activity.capacity }}</p>
            </div>
          </div>

          <span class="h-6 block"></span>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold mb-2 text-primary">Date de début</h3>
              <p class="text-text/70">{{ formatDate(activity.firstDay) }}</p>
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Date de fin</h3>
              <p class="text-text/70">{{ formatDate(activity.lastDay) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-error/25 rounded-lg shadow-lg shadow-error/35 p-8">
          <p class="text-xl font-bold text-error">
            Voulez-vous vraiment supprimer l'activité "{{ activity.title }}" ?
          </p>

          <span class="m-3"></span>

          <div
            v-if="errorMessage"
            class="mb-4 rounded-lg bg-danger/20 border border-danger/30 p-4 text-danger font-semibold"
          >
            {{ errorMessage }}
          </div>

          <p>
            <button
              @click="activityDelete()"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { role } from '@/services/authServices'
import { deleteActivity, getActivity } from '@/services/activityServices'
import { formatDate } from '@/utils/dateFormat'
import { gotoAdminDashboard } from '@/utils/redirections'

// ----------------
// Type definitions

interface Activity {
  id: string
  title: string
  description: string
  ageMin: number
  ageMax: number
  capacity: number
  firstDay: string
  lastDay: string
}

// ----------------
// Const def

// Router
const router = useRouter()

// Role de l'utilisateur courant
const roleUser = await role()

// Route (pour récuperer la query)
const route = useRoute()

// Id de l'activité
const activityId = typeof route.query.activityId === 'string' ? route.query.activityId : ''

// Activité suprimée
const activity = ref<Activity | null>(null)

// Message d'erreur
const errorMessage = ref<string>('')

// ----------------
// Fonctions

/**
 * Supprime l'activitée via l'API
 */
async function activityDelete() {
  errorMessage.value = ''

  try {
    await deleteActivity(activityId)

    gotoAdminDashboard()
  } catch (error: unknown) {
    errorMessage.value =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "Une erreur est survenue lors de la création de l'activité."
  }
}

// ----------------
// On load

onMounted(async () => {
  if (roleUser.data.role !== 'OWNER') {
    router.push('/login')
    return
  }
  try {
    const res = await getActivity(activityId)
    activity.value = res.data as Activity
  } catch (error) {
    console.error("Erreur lors de la récupération de l'activité :", error)
  }
})
</script>
