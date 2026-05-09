<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="bg-success/25 rounded-lg shadow-lg shadow-success/35 p-8">
        <h1 class="text-3xl font-bold text-success text-center">
          Création d'une activité
        </h1>
      </div>

      <form @submit.prevent="createNewActivity" class="pt-8">
        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">
            Informations de l'activité
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <h3 class="font-semibold mb-2 text-primary">Titre</h3>
              <input
                v-model="newActivity.title"
                type="text"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Christmas 2025"
                required
              />
            </div>

            <div class="md:col-span-2">
              <h3 class="font-semibold mb-2 text-primary">Description</h3>
              <textarea
                v-model="newActivity.description"
                rows="4"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Description de l'activité..."
                required
              ></textarea>
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Âge minimum</h3>
              <input
                v-model="newActivity.ageMin"
                type="number"
                min="0"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="6"
                required
              />
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Âge maximum</h3>
              <input
                v-model="newActivity.ageMax"
                type="number"
                min="0"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="10"
                required
              />
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Capacité</h3>
              <input
                v-model="newActivity.capacity"
                type="number"
                min="1"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="20"
                required
              />
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Date de début</h3>
              <input
                v-model="newActivity.firstDay"
                type="date"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Date de fin</h3>
              <input
                v-model="newActivity.lastDay"
                type="date"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
          </div>
        </div>

        <div class="bg-success/25 rounded-lg shadow-lg shadow-success/35 p-8">
          <p class="text-xl font-bold text-success">
            Voulez-vous vraiment ajouter l'activité
            "{{ newActivity.title }}" ?
          </p>

          <span class="m-3"></span>

          <div v-if="errorMessage" class="mb-4 rounded-lg bg-danger/20 border border-danger/30 p-4 text-danger font-semibold">
            {{ errorMessage }}
          </div>

          <p>
            <button
              type="submit"
              class="cursor-pointer bg-success p-2 rounded-full text-primary-light font-bold mr-3"
            >
              Créer l'activité
            </button>

            <button
              type="button"
              @click="gotoAdminDashboard()"
              class="cursor-pointer bg-info p-2 rounded-full text-primary-light font-bold"
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
import { postActivity } from '@/services/activityServices'

const router = useRouter()

const roleUser = await role()

const errorMessage = ref('')

const newActivity = reactive({
  title: '',
  description: '',
  ageMin: 0,
  ageMax: 0,
  capacity: 0,
  firstDay: '',
  lastDay: '',
})

async function createNewActivity() {
  errorMessage.value = ''

  try {
  const payload = {
    ...newActivity,
    firstDay: new Date(newActivity.firstDay).toISOString(),
    lastDay: new Date(newActivity.lastDay).toISOString(),
  }
  
  await postActivity(payload.title, payload.description, payload.ageMin, payload.ageMax, payload.capacity, payload.firstDay, payload.lastDay)
  
  router.push('/admin')
  } catch (error: any) {
    errorMessage.value =
    "Une erreur est survenue lors de la création de l'activité."
  }
}
error?.response?.data?.message ||

function gotoAdminDashboard() {
  router.push('/admin')
}

onMounted(async () => {
  if (roleUser.data.role != 'OWNER') {
    router.push('/login')
  }
})
</script>