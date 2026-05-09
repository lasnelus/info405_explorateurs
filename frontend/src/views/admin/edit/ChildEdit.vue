<template>
<div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div v-if="child" class="space-y-8">

        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8">
          <h1 class="text-3xl font-bold mb-4 text-primary">
            {{ child.firstName }} {{ child.lastName }}
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
          <div class="mt-8 border-t border-primary/20 pt-6">
          <h3 class="text-xl font-bold mb-4 text-primary">Ajouter une allergie</h3>
          <form @submit.prevent="addAllergie" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                v-model="newAllergy.allergy"
                type="text"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="allergie"
                required
              />
            </div>

            <div class="md:col-span-2">
              <button
                type="submit"
                class="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Ajouter allergies
              </button>
            </div>
          </form>
        </div>
        </div>


        <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8">
          <h2 class="text-2xl font-bold mb-6 text-primary">Contacts d'Urgence</h2>
          <div v-if="child.EmergencyContact.length > 0">
            <div class="space-y-4">
              <div v-for="contact in child.EmergencyContact" :key="contact.id" class="border-b border-primary/20 pb-4">
                <h3 class="font-semibold text-primary">{{ contact.firstName }} {{ contact.lastName }}</h3>
                <p class="text-text/70">Téléphone: {{ contact.phoneNumber }}</p>
              </div>
            </div>
          </div>
          <p v-else class="text-text/70">Aucun contact d'urgence enregistré</p>
          <div class="mt-8 border-t border-primary/20 pt-6">
          <h3 class="text-xl font-bold mb-4 text-primary">Ajouter un contact d'urgence</h3>

          <form @submit.prevent="addContact" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold mb-2 text-primary">Prénom</label>
              <input
                v-model="newContact.firstName"
                type="text"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Prénom"
                required
              />
            </div>

            <div>
              <label class="block font-semibold mb-2 text-primary">Nom</label>
              <input
                v-model="newContact.lastName"
                type="text"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Nom"
                required
              />
            </div>

            <div>
              <label class="block font-semibold mb-2 text-primary">Téléphone</label>
              <input
                v-model="newContact.phone"
                type="tel"
                class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Téléphone"
                required
              />
            </div>

            <div class="md:col-span-2">
              <button
                type="submit"
                class="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Ajouter le contact
              </button>
            </div>
          </form>
        </div>
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
    </div>
</div>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getChild } from '@/services/familyServices';
import { role } from '@/services/authServices'
import { addEmergencyContact, addAllergieChild, addFamilyChild } from '@/services/adminServices'

const route = useRoute()
const router = useRouter()

const childId = route.query.childId

const child = ref(null)

const roleUser = await role()

const newContact = reactive({
  firstName: '',
  lastName: '',
  phone: '',
})

const newAllergy = reactive({
  allergy:'',
})

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

function addContact(){
  addEmergencyContact(childId, newContact.firstName, newContact.lastName, newContact.phone)
}

function addAllergie(){
  addAllergieChild(childId, newAllergy.allergy)
}

function addFamily(){
  addFamilyChild(childId, familyId)
}



onMounted(async () =>{
    if (roleUser.data.role != 'OWNER') {
        router.push('/login')
    }else{
        const res = await getChild(childId)
        child.value = res.data
    }
})
</script>
