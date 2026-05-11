<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="bg-warn/25 rounded-lg shadow-lg shadow-warn/35 p-8">
        <h1 class="text-3xl font-bold text-warn text-center">
          Édition de la famille {{ family ? `- ${family.name}` : '' }}
        </h1>
      </div>

      <div v-if="family">
        <form @submit.prevent="submitFamilyUpdate" class="pt-8">
          <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
            <h2 class="text-2xl font-bold mb-6 text-primary">Informations de la famille</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="font-semibold mb-2 text-primary">Nom de la famille</h3>
                <input
                  v-model="editedFamily.name"
                  type="text"
                  class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
            </div>
          </div>

          <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8 mb-8">
            <h2 class="text-2xl font-bold mb-6 text-primary">Représentants légaux</h2>

            <div>
              <ul
                v-if="editedFamily.guardianIds.length > 0"
                class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3 space-y-2"
              >
                <li
                  v-for="id in editedFamily.guardianIds"
                  :key="id"
                  class="flex items-center justify-between bg-primary/20 border border-primary/30 px-3 py-2 rounded-lg text-text mb-2"
                >
                  <span>{{ getGuardianName(id) }}</span>
                  <button
                    type="button"
                    @click="removeGuardianFromFamilyDraft(id)"
                    class="text-text bg-error rounded-full cursor-pointer font-bold hover:bg-error/75 px-2"
                  >
                    Retirer
                  </button>
                </li>
              </ul>
              <p v-else class="text-text/70 mb-4">Aucun représentant légal assigné.</p>
            </div>

            <select
              v-model="guardianToAdd"
              @change="addGuardianToFamilyDraft"
              class="w-full rounded-lg border border-primary/20 bg-primary-background/50 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/30 mt-4"
            >
              <option disabled value="">-- Ajouter un responsable légal --</option>
              <option
                v-for="guardian in availableGuardians"
                :key="guardian.id"
                :value="guardian.id"
              >
                {{ guardian.firstName }} {{ guardian.lastName }}
              </option>
            </select>
          </div>

          <div class="bg-warn/25 rounded-lg shadow-lg shadow-warn/35 p-8">
            <p class="text-xl font-bold text-warn">
              Voulez-vous vraiment sauvegarder les modifications pour la famille
              {{ editedFamily.name }} ?
            </p>

            <span class="m-3 block"></span>

            <div class="flex gap-4">
              <button
                type="submit"
                class="cursor-pointer bg-warn p-3 rounded-full text-primary-light font-bold"
              >
                Mettre à jour la famille
              </button>
              <button
                type="button"
                @click="gotoAdminDashboard"
                class="cursor-pointer bg-info p-3 rounded-full text-primary-light font-bold"
              >
                Revenir au panel admin
              </button>
            </div>
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
import { getGuardian } from '@/services/guardianService'
import {
  addGuardianToFamily,
  getFamily,
  patchFamily,
  removeGuardianFromFamily,
} from '@/services/familyServices'
import { gotoAdminDashboard } from '@/utils/redirections'

// ----------------
// Type definitions

type Guardian = {
  id: string
  firstName: string
  lastName: string
}

type Family = {
  id: string
  name: string
  guardians: Guardian[]
}

type EditedFamily = {
  name: string
  guardianIds: string[]
}

// ----------------
// Const def

// Route (pour query)
const route = useRoute()

// Routeur
const router = useRouter()

// Role de l'utilisateur
const roleUser = await role()

// Id de la famille via la route
const familyId = Array.isArray(route.query.familyId)
  ? route.query.familyId[0]
  : route.query.familyId

// Famille
const family = ref<Family | null>(null)

// Message d'erreur
const errorMessage = ref('')

// Liste de tout les gardiens
const allGuardians = ref<Guardian[]>([])

// gardien a ajouter a la famille
const guardianToAdd = ref<string>('')

// Brouillon de la famille modifiée
const editedFamily = reactive<EditedFamily>({
  name: '',
  guardianIds: [],
})

// Liste des gardiens disponibles pour être ajoutés a la famille
const availableGuardians = computed(() => {
  return allGuardians.value.filter((guardian) => !editedFamily.guardianIds.includes(guardian.id))
})

// ----------------
// Fonctions

/**
 * Ajoute un gardien au "brouillon" de la famille modifiée
 */
const addGuardianToFamilyDraft = () => {
  if (guardianToAdd.value && !editedFamily.guardianIds.includes(guardianToAdd.value)) {
    editedFamily.guardianIds.push(guardianToAdd.value)
    guardianToAdd.value = ''
  }
}

/**
 * Retire un gardien du "brouillon" de la famille modifiée
 * @param idToRemove Id du gardien
 */
const removeGuardianFromFamilyDraft = (idToRemove: string) => {
  const index = editedFamily.guardianIds.findIndex((id) => id === idToRemove)
  if (index !== -1) {
    editedFamily.guardianIds.splice(index, 1)
  }
}

/**
 * Obtiens le nom d'un guardian a partir de son ID
 * @param id Id du guardian a interroger
 */
const getGuardianName = (id: string): string => {
  const guardian = allGuardians.value.find((g) => g.id === id)
  return guardian ? `${guardian.firstName} ${guardian.lastName}` : 'Inconnu'
}

/**
 * Met a jout une famille via l'API
 */
async function submitFamilyUpdate() {
  errorMessage.value = ''

  try {
    if (!familyId || !family.value) return

    await patchFamily(familyId as string, editedFamily.name)

    const existingGuardianIds = family.value.guardians.map((g) => String(g.id))

    const newGuardianIds = editedFamily.guardianIds.map((id) => String(id))

    // Ajout des guardians qui ont été ajoutés
    for (const guardianId of newGuardianIds) {
      if (!existingGuardianIds.includes(guardianId)) {
        await addGuardianToFamily(familyId as string, guardianId)
      }
    }

    // Retrait des guardians qui ont été retirés
    for (const oldGuardianId of existingGuardianIds) {
      if (!editedFamily.guardianIds.includes(oldGuardianId)) {
        await removeGuardianFromFamily(familyId as string, oldGuardianId)
      }
    }

    gotoAdminDashboard()
  } catch (error: unknown) {
    errorMessage.value =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Une erreur est survenue lors de la modification de la famille'
  }
}

// ----------------
// On load

onMounted(async () => {
  if (roleUser.data.role !== 'OWNER') {
    router.push('/login')
    return
  }

  if (!familyId) return

  try {
    const response = await getGuardian()
    allGuardians.value = response.data as Guardian[]
  } catch (error: unknown) {
    console.error('Erreur lors du chargement des représentants légaux :', error)
  }

  try {
    const res = await getFamily(familyId as string)
    family.value = res.data

    editedFamily.name = res.data.name
    editedFamily.guardianIds = res.data.guardians?.map((g: Guardian) => g.id) || []
  } catch (error) {
    console.error('Erreur lors de la récupération de la famille :', error)
  }
})
</script>
