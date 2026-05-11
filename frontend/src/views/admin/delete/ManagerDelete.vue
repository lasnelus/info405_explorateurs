<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div v-if="instructor" class="space-y-8">
        <div class="bg-error/25 rounded-lg shadow-lg shadow-error/35 p-8">
          <h1 class="text-3xl font-bold text-error text-center">
            Confirmation de suppression de l'animateur
          </h1>
        </div>

        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Informations Personnelles</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold mb-2 text-primary">Prénom</h3>
              <p class="text-text/70 text-lg font-bold">{{ instructor.firstName }}</p>
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Nom</h3>
              <p class="text-text/70 text-lg font-bold">{{ instructor.lastName }}</p>
            </div>

            <div class="md:col-span-2">
              <h3 class="font-semibold mb-2 text-primary">Email</h3>
              <p class="text-text/70">{{ instructor.email }}</p>
            </div>
          </div>
        </div>

        <div class="bg-error/25 rounded-lg shadow-lg shadow-error/35 p-8">
          <p class="text-xl font-bold text-error">
            Voulez-vous vraiment supprimer l'animateur "{{ instructor.firstName }}
            {{ instructor.lastName }}" ?
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
              @click="instructorDelete()"
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
import { getManagerbyId, deleteManager } from '@/services/adminServices'
import { gotoAdminDashboard } from '@/utils/redirections'

// ----------------
// Type definitions

interface Instructor {
  id: string
  email: string
  firstName: string
  lastName: string
}

// ----------------
// Const def

const route = useRoute()

const router = useRouter()

const instructorId = typeof route.query.instructorId === 'string' ? route.query.instructorId : ''

const instructor = ref<Instructor | null>(null)

const errorMessage = ref<string>('')

const roleUser = await role()

// ----------------
// Fonctions

/**
 * Suprime un manager via l'API
 */
async function instructorDelete() {
  errorMessage.value = ''

  try {
    await deleteManager(instructorId)
    gotoAdminDashboard()
  } catch (error: unknown) {
    errorMessage.value =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "Une erreur est survenue lors de la suppression de l'animateur."
  }
}

// ----------------
// On load

onMounted(async () => {
  if (roleUser.data.role !== 'OWNER') {
    router.push('/login')
    return
  }

  if (!instructorId) return

  try {
    const res = await getManagerbyId(instructorId)
    instructor.value = res.data as Instructor
  } catch (error) {
    console.error("Erreur lors de la récupération de l'animateur :", error)
  }
})
</script>
