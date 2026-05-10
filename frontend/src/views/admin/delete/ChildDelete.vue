<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div v-if="child" class="space-y-8">
        <div class="bg-error/25 rounded-lg shadow-lg shadow-error/35 p-8">
          <h1 class="text-3xl font-bold text-error text-center">
            Confirmation de supression de {{ child.firstName }} {{ child.lastName }}
          </h1>
        </div>

        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Informations Personnelles</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold mb-2 text-primary">Prénom</h3>
              <p class="text-text/70">{{ child.firstName }}</p>
            </div>
            <div>
              <h3 class="font-semibold mb-2 text-primary">Nom</h3>
              <p class="text-text/70">{{ child.lastName }}</p>
            </div>
            <div>
              <h3 class="font-semibold mb-2 text-primary">Date de Naissance</h3>
              <p class="text-text/70">{{ formatDate(child.birthDate) }}</p>
            </div>
            <div>
              <h3 class="font-semibold mb-2 text-primary">Contraintes Alimentaires</h3>
              <p class="text-text/70">{{ child.foodConstraint }}</p>
            </div>
          </div>
        </div>

        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Allergies</h2>
          <div v-if="child.allergies.length > 0">
            <ul class="space-y-2">
              <li v-for="allergy in child.allergies" :key="allergy.id" class="text-text/70">
                {{ allergy.allergy }}
              </li>
            </ul>
          </div>
          <p v-else class="text-text/70">Aucune allergie connue</p>
        </div>

        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Contacts d'Urgence</h2>
          <div v-if="child.EmergencyContact.length > 0">
            <div class="space-y-4">
              <div
                v-for="contact in child.EmergencyContact"
                :key="contact.id"
                class="border-b border-primary/20 pb-4"
              >
                <h3 class="font-semibold text-primary">
                  {{ contact.firstName }} {{ contact.lastName }}
                </h3>
                <p class="text-text/70">Téléphone: {{ contact.phoneNumber }}</p>
              </div>
            </div>
          </div>
          <p v-else class="text-text/70">Aucun contact d'urgence enregistré</p>
        </div>

        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Familles</h2>
          <div v-if="child.families.length > 0">
            <ul class="space-y-2">
              <li v-for="family in child.families" :key="family.id" class="text-text/70">
                {{ family.name }}
              </li>
            </ul>
          </div>
          <p v-else class="text-text/70">Aucune famille associée</p>
        </div>

        <div class="bg-error/25 rounded-lg shadow-lg shadow-error/35 p-8">
          <p class="text-xl font-bold text-error">
            Voulez vous vraiment supprimer {{ child.firstName }} {{ child.lastName }}? Cette action
            est irréversible.
          </p>

          <span class="m-3"></span>

          <p>
            <button
              @click="childDelete()"
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
import { getChild } from '@/services/childServices'
import { role } from '@/services/authServices'
import { deleteChild } from '@/services/childServices'

const route = useRoute()
const router = useRouter()

const childId = route.query.childId

const child = ref(null)

const errorMessage = ref();

const roleUser = await role()

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

async function childDelete() {
  errorMessage.value = ''

  try {
    await deleteChild(childId)

    router.push('/admin')
  } catch (error: any) {
    errorMessage.value =
      error?.response?.data?.message || "Une erreur est survenue lors de la création de l'activité."
  }
}

function gotoAdminDashboard() {
  router.push('/admin')
}

onMounted(async () => {
  if (roleUser.data.role != 'OWNER') {
    router.push('/login')
  } else {
    const res = await getChild(childId)
    child.value = res.data
  }
})
</script>
