<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="bg-warn/25 rounded-lg shadow-lg shadow-warn/35 p-8">
        <h1 class="text-3xl font-bold text-warn text-center">
          Modification d'une activité
        </h1>
      </div>

      <form
        v-if="activity"
        @submit.prevent="updateActivity"
        class="pt-8"
      >
        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">
            Informations de l'activité
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <h3 class="font-semibold mb-2 text-primary">Titre</h3>
              <input
                v-model="activity.title"
                type="text"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            <div class="md:col-span-2">
              <h3 class="font-semibold mb-2 text-primary">Description</h3>
              <textarea
                v-model="activity.description"
                rows="4"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              ></textarea>
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Âge minimum</h3>
              <input
                v-model="activity.ageMin"
                type="number"
                min="0"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Âge maximum</h3>
              <input
                v-model="activity.ageMax"
                type="number"
                min="0"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Capacité</h3>
              <input
                v-model="activity.capacity"
                type="number"
                min="1"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Date de début</h3>
              <input
                v-model="activity.firstDay"
                type="date"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            <div>
              <h3 class="font-semibold mb-2 text-primary">Date de fin</h3>
              <input
                v-model="activity.lastDay"
                type="date"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
          </div>
        </div>

        <div class="bg-warn/25 rounded-lg shadow-lg shadow-warn/35 p-8">
          <p class="text-xl font-bold text-warn">
            Voulez-vous vraiment modifier l'activité
            "{{ activity.title }}" ?
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
              type="submit"
              class="cursor-pointer bg-warn p-3 rounded-full text-primary-light font-bold mr-3"
            >
              Modifier l'activité
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
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router'
import { getActivity, patchActivity } from '@/services/activityServices'
import { role } from '@/services/authServices'

interface Activity {
  title: string
  description: string
  ageMin: number
  ageMax: number
  capacity: number
  firstDay: string
  lastDay: string
}

const route = useRoute()
const router = useRouter()

const activityId = computed<string | null>(() => {
  const id = route.query.activityId as LocationQueryValue | LocationQueryValue[] | undefined

  if (!id) return null
  if (Array.isArray(id)) return id[0] ?? null

  return id
})

const activity = ref<Activity | null>(null)
const errorMessage = ref('')

// ✅ typage du rôle
const roleUser = await role() as { data: { role: string } }

function formatDateForInput(date: string) {
  return new Date(date).toISOString().split('T')[0]
}

async function updateActivity() {
  errorMessage.value = ''

  if (!activity.value || !activityId.value) return

  try {
    const payload: Activity = {
      ...activity.value,
      firstDay: new Date(activity.value.firstDay).toISOString(),
      lastDay: new Date(activity.value.lastDay).toISOString(),
    }

    await patchActivity(
      activityId.value,
      payload.title,
      payload.description,
      payload.ageMin,
      payload.ageMax,
      payload.capacity,
      payload.firstDay,
      payload.lastDay
    )

    router.push('/admin')
  } catch (e: unknown) {
    errorMessage.value =
      (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "Une erreur est survenue lors de la modification de l'activité."
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

  if (!activityId.value) {
    errorMessage.value = "ID d'activité manquant."
    return
  }

  try {
    const res = await getActivity(activityId.value)

    activity.value = {
      ...res.data,
      firstDay: formatDateForInput(res.data.firstDay),
      lastDay: formatDateForInput(res.data.lastDay),
    }
  } catch {
    errorMessage.value =
      "Impossible de charger les informations de l'activité."
  }
})
</script>
