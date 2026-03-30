<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div v-if="child" class="space-y-8">

        <div class="bg-primary-background rounded-lg shadow-lg shadow-primary/15 p-8">
          <h1 class="text-3xl font-bold mb-4 text-primary">
            {{ child.firstName }} {{ child.lastName }}
          </h1>
        </div>


        <div class="bg-primary-background rounded-lg shadow-lg shadow-primary/15 p-8">
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


        <div class="bg-primary-background rounded-lg shadow-lg shadow-primary/15 p-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Allergies</h2>
          <div v-if="child.allergies.length > 0">
            <ul class="space-y-2">
              <li v-for="allergy in child.allergies" :key="allergy.id" class="text-text/70">
                {{ allergy.name }}
              </li>
            </ul>
          </div>
          <p v-else class="text-text/70">Aucune allergie connue</p>
        </div>


        <div class="bg-primary-background rounded-lg shadow-lg shadow-primary/15 p-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Contacts d'Urgence</h2>
          <div v-if="child.EmergencyContact.length > 0">
            <div class="space-y-4">
              <div v-for="contact in child.EmergencyContact" :key="contact.id" class="border-b border-primary/20 pb-4">
                <h3 class="font-semibold text-primary">{{ contact.firstName }} {{ contact.lastName }}</h3>
                <p class="text-text/70">Relation: {{ contact.relationship }}</p>
                <p class="text-text/70">Téléphone: {{ contact.phone }}</p>
              </div>
            </div>
          </div>
          <p v-else class="text-text/70">Aucun contact d'urgence enregistré</p>
        </div>


        <div class="bg-primary-background rounded-lg shadow-lg shadow-primary/15 p-8">
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


        <div class="bg-primary-background rounded-lg shadow-lg shadow-primary/15 p-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Jours Inscrits</h2>
          <div v-if="child.slots.length > 0">
            <ul class="space-y-2">
              <li v-for="slot in child.slots" :key="slot.id" class="text-text/70">
                <time :datetime="slot.day">{{ formatDate(slot.day) }}</time>
              </li>
            </ul>
          </div>
          <p v-else class="text-text/70">Aucun jour inscrit</p>
        </div>


        <div class="bg-primary-background rounded-lg shadow-lg shadow-primary/15 p-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Jours en Attente</h2>
          <div v-if="child.queues.length > 0">
            <ul class="space-y-2">
              <li v-for="queue in child.queues" :key="queue.id" class="text-text/70">
                <time :datetime="queue.date">{{ formatDate(queue.date) }}</time>
              </li>
            </ul>
          </div>
          <p v-else class="text-text/70">Aucun jour en attente</p>
        </div>
      </div>
      <div v-else class="flex justify-center items-center py-12">
        <p class="text-text/70">Chargement...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getChild } from '@/services/familyServices';
import { loadProfileIfNeeded } from '@/services/authServices';

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const childId = route.query.childId

const child = ref(null)

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

onMounted(async () =>{
  if(auth.isLoggedIn){
    await loadProfileIfNeeded(auth)
    if (auth.profile != null) {
      const res = await getChild(childId)
      child.value = res.data
    } else {
      router.push('/')
    }
  } else {
    router.push('/login')
  }
})
</script>
