<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="bg-warn/25 rounded-lg shadow-lg shadow-warn/35 p-8">
        <h1 class="text-3xl font-bold text-warn text-center">
          Édition d'un enfant {{ child ? `- ${child.firstName} ${child.lastName}` : '' }}
        </h1>
      </div>

      <div v-if="child">
        <form @submit.prevent="submitChildUpdate" class="pt-8">
          <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
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
                <p class="text-text/70">{{ getFoodConstraintLabel(child.foodConstraint) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
            <h2 class="text-2xl font-bold mb-6 text-primary">Allergies</h2>

            <div v-if="child.allergies.length > 0" class="mb-4">
              <ul class="space-y-2">
                <li
                  v-for="allergy in child.allergies"
                  :key="allergy.id"
                  class="text-text/70 bg-primary/10 px-3 py-2 rounded-lg"
                >
                  {{ allergy.allergy }}
                </li>
              </ul>
            </div>
            <p v-else class="text-text/70 mb-4">Aucune allergie connue enregistrée</p>

            <div v-if="editedChild.newAllergies.length > 0" class="mb-4">
              <h4 class="font-semibold text-warn mb-2">Nouvelles allergies à ajouter :</h4>
              <ul class="space-y-2">
                <li
                  v-for="(allergy, index) in editedChild.newAllergies"
                  :key="index"
                  class="text-text/70 bg-warn/20 px-3 py-2 rounded-lg flex justify-between items-center"
                >
                  {{ allergy }}
                  <button
                    type="button"
                    @click="editedChild.newAllergies.splice(index, 1)"
                    class="text-primary-light bg-error rounded-full cursor-pointer font-bold hover:bg-error/75 px-2"
                  >
                    Retirer
                  </button>
                </li>
              </ul>
            </div>

            <div class="border-t border-primary/20 pt-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    v-model="tempAllergy.allergy"
                    type="text"
                    class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Nom de l'allergie"
                  />
                </div>
                <div class="md:col-span-2">
                  <button
                    type="button"
                    @click="pushAllergyToDraft"
                    class="bg-primary/80 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Ajouter l'allergie (Brouillon)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
            <h2 class="text-2xl font-bold mb-6 text-primary">Contacts d'Urgence</h2>

            <div v-if="child.EmergencyContact.length > 0" class="mb-4">
              <div class="space-y-4">
                <div
                  v-for="contact in child.EmergencyContact"
                  :key="contact.id"
                  class="border-l-4 border-primary/40 pl-4 py-2 bg-primary/5"
                >
                  <h3 class="font-semibold text-primary">
                    {{ contact.firstName }} {{ contact.lastName }}
                  </h3>
                  <p class="text-text/70">Téléphone: {{ contact.phoneNumber }}</p>
                </div>
              </div>
            </div>
            <p v-else class="text-text/70 mb-4">Aucun contact d'urgence enregistré</p>

            <div v-if="editedChild.newContacts.length > 0" class="mb-4">
              <h4 class="font-semibold text-warn mb-2">Nouveaux contacts à ajouter :</h4>
              <div class="space-y-2">
                <div
                  v-for="(contact, index) in editedChild.newContacts"
                  :key="index"
                  class="border-l-4 border-warn/40 pl-4 py-2 bg-warn/10 flex justify-between items-center"
                >
                  <div>
                    <h3 class="font-semibold text-text">
                      {{ contact.firstName }} {{ contact.lastName }}
                    </h3>
                    <p class="text-text/70">Téléphone: {{ contact.phone }}</p>
                  </div>
                  <button
                    type="button"
                    @click="editedChild.newContacts.splice(index, 1)"
                    class="text-primary-light bg-error rounded-full cursor-pointer font-bold hover:bg-error/75 px-2 mr-3"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            </div>

            <div class="border-t border-primary/20 pt-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold mb-2 text-primary">Prénom</label>
                  <input
                    v-model="tempContact.firstName"
                    type="text"
                    class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label class="block font-semibold mb-2 text-primary">Nom</label>
                  <input
                    v-model="tempContact.lastName"
                    type="text"
                    class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label class="block font-semibold mb-2 text-primary">Téléphone</label>
                  <input
                    v-model="tempContact.phone"
                    type="tel"
                    class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div class="md:col-span-2">
                  <button
                    type="button"
                    @click="pushContactToDraft"
                    class="bg-primary/80 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Ajouter le contact (Brouillon)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
            <h2 class="text-2xl font-bold mb-6 text-primary">Familles</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul v-if="editedChild.familyIds.length > 0" class="mb-3 space-y-2">
                <li
                  v-for="id in editedChild.familyIds"
                  :key="id"
                  class="flex items-center justify-between bg-primary/20 border border-primary/30 px-3 py-2 rounded-lg text-text"
                >
                  <span>{{ getFamilyName(id) }}</span>
                  <button
                    type="button"
                    @click="removeFamilyFromChild(id)"
                    class="text-primary-light bg-error rounded-full cursor-pointer font-bold hover:bg-error/75 px-2"
                    title="Retirer cette famille"
                  >
                    Retirer
                  </button>
                </li>
              </ul>
            </div>
            <select
              v-model="familyToAdd"
              @change="addFamilyToChild"
              class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30 mt-4"
            >
              <option disabled value="">-- Ajouter une famille --</option>
              <option v-for="famille in availableFamilies" :key="famille.id" :value="famille.id">
                {{ famille.name }}
              </option>
            </select>
          </div>

          <div class="bg-warn/25 rounded-lg shadow-lg shadow-warn/35 p-8">
            <p class="text-xl font-bold text-warn">
              Voulez vous vraiment sauvegarder les modifications pour {{ child.firstName }}
              {{ child.lastName }}?
            </p>

            <span class="m-3"></span>

            <p>
              <button
                type="submit"
                class="cursor-pointer bg-warn p-3 rounded-full text-primary-light font-bold mr-3"
              >
                Mettre à jour l'enfant
              </button>
              <button
                type="button"
                @click="gotoAdminDashboard()"
                class="cursor-pointer bg-info p-3 rounded-full text-primary-light font-bold"
              >
                Revenir au panel admin
              </button>
            </p>
            <p v-if="errorMessage" class="text-error font-bold mt-4">{{ errorMessage }}</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { role } from '@/services/authServices'
import { getChild, addEmergencyContact, addAllergieChild } from '@/services/childServices'
import { addChildToFamily, getFamilies } from '@/services/familyServices'
import { formatDate } from '@/utils/dateFormat'
import { gotoAdminDashboard } from '@/utils/redirections'

// ----------------
// Type definitions

type Allergy = {
  id: string
  allergy: string
}

type EmergencyContact = {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
}

type Family = {
  id: string
  name: string
}

type Child = {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  foodConstraint: string
  allergies: Allergy[]
  EmergencyContact: EmergencyContact[]
  families: Family[]
}

type EditedChild = {
  familyIds: string[]
  newAllergies: string[]
  newContacts: { firstName: string; lastName: string; phone: string }[]
}

// ----------------
// Const def

const route = useRoute()

const router = useRouter()

const roleUser = await role()

const childId = Array.isArray(route.query.childId) ? route.query.childId[0] : route.query.childId

const child = ref<Child | null>(null)

const errorMessage = ref('')

const allFamilies = ref<Family[]>([])

const familyToAdd = ref<string>('')

const foodConstraintsOptions = [
  { value: 'NONE', label: 'Aucune restriction' },
  { value: 'NO_PORK', label: 'Sans porc' },
  { value: 'NO_MEAT', label: 'Sans viande (Végétarien)' },
  { value: 'ALLERGY_OR_INTOLERANCE', label: 'Allergie ou intolérance' },
]

const editedChild = reactive<EditedChild>({
  familyIds: [],
  newAllergies: [],
  newContacts: [],
})

const tempAllergy = reactive({ allergy: '' })

const tempContact = reactive({ firstName: '', lastName: '', phone: '' })

const availableFamilies = computed(() => {
  return allFamilies.value.filter((family) => !editedChild.familyIds.includes(family.id))
})

// ----------------
// Fonctions

/**
 * Obtiens le label (nom lisible) d'une contrainte alimentaire
 */
function getFoodConstraintLabel(value: string): string {
  const option = foodConstraintsOptions.find((opt) => opt.value === value)
  return option ? option.label : value
}

/**
 * Ajoute une famille au "brouillon" de l'enfant a modifier
 */
const addFamilyToChild = () => {
  if (familyToAdd.value && !editedChild.familyIds.includes(familyToAdd.value)) {
    editedChild.familyIds.push(familyToAdd.value)
    familyToAdd.value = ''
  }
}

/**
 * Enlève une famille au "brouillon" de l'enfant a modifier
 * @param idToRemove L'id de la famille a enlever
 */
const removeFamilyFromChild = (idToRemove: string) => {
  const index = editedChild.familyIds.findIndex((id) => id === idToRemove)
  if (index !== -1) {
    editedChild.familyIds.splice(index, 1)
  }
}

/**
 * Obtien le nom d'une famille
 * @param id L'id de la famille a interoger
 */
const getFamilyName = (id: string): string => {
  const family = allFamilies.value.find((f) => f.id === id)
  return family ? family.name : 'Inconnue'
}

/**
 * Ajoute une allergie au "brouillon" de l'enfant a modifier
 */
const pushAllergyToDraft = () => {
  if (tempAllergy.allergy.trim()) {
    editedChild.newAllergies.push(tempAllergy.allergy.trim())
    tempAllergy.allergy = ''
  }
}

/**
 * Ajoute un contact au "brouillon" de l'enfant a modifier
 */
const pushContactToDraft = () => {
  if (tempContact.firstName && tempContact.lastName && tempContact.phone) {
    editedChild.newContacts.push({ ...tempContact })
    tempContact.firstName = ''
    tempContact.lastName = ''
    tempContact.phone = ''
  }
}

/**
 * Met a jout un enfant via l'API
 */
async function submitChildUpdate() {
  errorMessage.value = ''

  try {
    if (childId && child.value) {
      // On renvoie les infos personnelles non modifiées + le nouveau tableau de familles
      editedChild.familyIds.forEach(async (familyId) => {
        await addChildToFamily(familyId, childId as string)
      })

      for (const allergy of editedChild.newAllergies) {
        await addAllergieChild(childId as string, allergy)
      }

      for (const contact of editedChild.newContacts) {
        await addEmergencyContact(
          childId as string,
          contact.firstName,
          contact.lastName,
          contact.phone,
        )
      }

      gotoAdminDashboard()
    }
  } catch (error: unknown) {
    errorMessage.value =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "Une erreur est survenue lors de la modification de l'enfant"
  }
}

// ----------------
// On load

onMounted(async () => {
  if (roleUser.data.role !== 'OWNER') {
    router.push('/login')
    return
  }

  if (!childId) return

  try {
    const familiesResponse = await getFamilies()
    allFamilies.value = familiesResponse.data as Family[]
  } catch (error) {
    console.error('Erreur lors de la récupération des familles:', error)
  }

  try {
    const res = await getChild(childId as string)
    child.value = res.data
    // On extrait uniquement les IDs des familles pour le brouillon
    editedChild.familyIds = res.data.families.map((family: Family) => family.id)
  } catch (error) {
    console.error("Erreur lors de la récupération de l'enfant:", error)
  }
})
</script>
