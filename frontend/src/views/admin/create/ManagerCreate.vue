<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="bg-success/25 rounded-lg shadow-lg shadow-success/35 p-8">
        <h1 class="text-3xl font-bold text-success text-center">Creation d'un manager</h1>
      </div>

      <form @submit.prevent="createNewManager" class="pt-8">
        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Informations Personnelles</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold mb-2 text-primary">Email</h3>
              <input
                v-model="newManager.email"
                type="email"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="mathéo.dupont@example.com"
                required
              />
            </div>
            <div>
              <h3 class="font-semibold mb-2 text-primary">Mot de passe</h3>
              <input
                v-model="newManager.password"
                type="password"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="********"
                required
              />
            </div>
            <div>
              <h3 class="font-semibold mb-2 text-primary">Prénom</h3>
              <input
                v-model="newManager.firstName"
                type="text"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Mathéo"
                required
              />
              <!-- <p class="text-text/70">{{ child.firstName }}</p> -->
            </div>
            <div>
              <h3 class="font-semibold mb-2 text-primary">Nom</h3>
              <input
                v-model="newManager.lastName"
                type="text"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Dupont"
                required
              />
            </div>
          </div>
        </div>

        <div class="bg-success/25 rounded-lg shadow-lg shadow-success/35 p-8">
          <p class="text-xl font-bold text-success">
            Voulez vous vraiment ajouter {{ newManager.firstName }} {{ newManager.lastName }}?
          </p>

          <span class="m-3"></span>

          <p>
            <button
              type="submit"
              class="cursor-pointer bg-success p-3 rounded-full text-primary-light font-bold mr-3"
            >
              Créer un manager
            </button>
            <button
              @click="gotoAdminDashboard()"
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
import { createManager } from '@/services/adminServices'

const router = useRouter()

const roleUser = await role()

const errorMessage = ref('')

const newManager = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'MANAGER',
})

async function createNewManager() {
  errorMessage.value = ''

  try {
    const payload = {
      ...newManager,
    }

    await createManager(
      payload.email,
      payload.password,
      payload.firstName,
      payload.lastName,
      "INSTRUCTOR"
    )

    router.push('/admin')
  } catch (error: unknown) {
    errorMessage.value =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Une erreur est survenue lors de la creation de l'enfant"
  }
}

function gotoAdminDashboard() {
  router.push('/admin')
}

onMounted(async () => {
  if (roleUser.data.role != 'OWNER') {
    router.push('/login')
  }
})
</script>
