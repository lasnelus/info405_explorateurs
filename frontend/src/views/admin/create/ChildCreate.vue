<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="bg-success/25 rounded-lg shadow-lg shadow-success/35 p-8">
        <h1 class="text-3xl font-bold text-success text-center">Creation d'un enfant</h1>
      </div>

      <form @submit.prevent="createNewChild" class="pt-8">
        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Informations Personnelles</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold mb-2 text-primary">Prénom</h3>
              <input
                v-model="newChild.firstName"
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
                v-model="newChild.lastName"
                type="text"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Dupont"
                required
              />
            </div>
            <div>
              <h3 class="font-semibold mb-2 text-primary">Date de Naissance</h3>
              <input
                v-model="newChild.birthDate"
                type="date"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            <div>
              <h3 class="font-semibold mb-2 text-primary">Contraintes Alimentaires</h3>
              <input
                v-model="newChild.foodConstraint"
                type="text"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="végétarien"
              />
            </div>
          </div>
        </div>

        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Familles</h2>
          <input
            v-model="newChild.familyIds"
            type="text"
            class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Dupont"
          />
        </div>

        <div class="bg-success/25 rounded-lg shadow-lg shadow-success/35 p-8">
          <p class="text-xl font-bold text-success">
            Voulez vous vraiment ajouter {{ newChild.firstName }} {{ newChild.lastName }}?
          </p>

          <span class="m-3"></span>

          <p>
            <button
              type="submit"
              class="cursor-pointer bg-success p-2 rounded-full text-primary-light font-bold mr-3"
            >
              Créer un enfant
            </button>
            <button
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
import { addNewChild } from '@/services/childServices'

const router = useRouter()

const roleUser = await role()

const errorMessage = ref('')

const newChild = reactive({
  firstName: '',
  lastName: '',
  birthDate: '',
  foodConstraint: '',
  familyIds: [],
})

async function createNewChild() {
  errorMessage.value = ''

  try {
    const payload = {
      ...newChild,
      birthDate: new Date(newChild.birthDate).toISOString(),
    }

    await addNewChild(
      payload.firstName,
      payload.lastName,
      payload.birthDate,
      payload.foodConstraint,
      payload.familyIds,
    )

    router.push('/admin')
  } catch (error: any) {
    errorMessage.value =
      error?.response?.data?.message || "Une erreur est survenue lors de la creation de l'enfant"
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
