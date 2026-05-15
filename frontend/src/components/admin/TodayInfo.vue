<template>
  <div class="m-3 mr-6 mb-6">
    <h1 class="text-2xl font-bold mb-6 color-primary">Aujourd'hui</h1>

    <!-- ENFANTS PRESENTS -->
    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">Enfants présents</h2>

      <div class="relative overflow-x-auto bg-primary border-2 border-text/75 rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="border-b border-default">
            <tr>
              <th scope="col">NOM</th>
              <th scope="col">PRENOM</th>
              <th scope="col">REGIME SPECIAL ?</th>
              <th scope="col">PRESENT ?</th>
              <th scope="col" class="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="todayChilds.length > 0">
              <tr v-for="(enfant, index) in todayChilds" :key="index">
                <td>{{ enfant.lastName }}</td>
                <td>{{ enfant.firstName }}</td>
                <td>{{ enfant.foodConstraint == 'NONE' ? 'NON' : enfant.foodConstraint }}</td>

                <td class="p-0!">
                  <label class="flex justify-center items-center cursor-pointer w-1/2">
                    <input
                      type="checkbox"
                      :checked="isChildPresentToday(enfant)"
                      @change="
                        handleAttendance(enfant, ($event.target as HTMLInputElement).checked)
                      "
                      class="peer sr-only"
                      :class="{ 'opacity-100': isChildPresentToday(enfant) }"
                    />
                    <div
                      class="w-10 h-10 flex items-center justify-center bg-(--header-color) rounded border border-text peer-checked:bg-success"
                    >
                      <svg
                        class="w-7 h-7 text-white opacity-0 transition"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        viewBox="0 0 24 24"
                        :class="{ 'opacity-100': enfant.present }"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </label>
                </td>
                <td class="text-right" v-if="roleUser.data.role == 'OWNER'">
                  <span>
                    <button @click="gotoChildEdit(enfant.id)" class="edit">
                      <p>Editer</p>
                    </button>
                  </span>
                </td>
                <td class="text-right" v-else>N/A</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="6" class="p-8 text-center text-text font-medium italic">
                  Aucun enfant n'est présent pour cette date.
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Separateur -->
    <span class="h-20 block"></span>

    <!-- REPAS DU JOUR -->
    <div>
      <h2 class="text-xl font-bold mb-1 text-text/85 uppercase">repas du jour</h2>
      <div class="relative overflow-x-auto bg-primary border-2 border-text/75 rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="border-b border-default">
            <tr>
              <th scope="col">type</th>
              <th scope="col">nb unit</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="repasAujourdhui.length > 0">
              <tr v-for="(repas, index) in repasAujourdhui" :key="index">
                <td>{{ repas.label }}</td>
                <td>{{ repas.nb_unit }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="6" class="p-8 text-center text-text font-medium italic">
                  Aucun repas n'est prévu pour cette date.
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { role } from '@/services/authServices'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { setAttendance } from '@/services/activityServices'
import { calcFoodList, filterFoodList } from '@/utils/foodCalc'

// ----------------
// Type definitions


type Slot = {
  id: string
  childId: string
  periodeId: string
  day: string
  isChildPresent: boolean
  createdAt: string
  updatedAt: string
}

type Enfant = {
  id: string
  firstName: string
  lastName: string
  foodConstraint: string
  present: boolean
  slots: Slot[]
}

// ----------------
// Const def

const router = useRouter()

const roleUser = await role()

// ----------------
// Props (provenance: src/view/admin/adminMain.vue)

const props = defineProps<{
  todayChilds: Enfant[]
}>()

const repasAujourdhui = computed(() => {
  return filterFoodList(calcFoodList(props.todayChilds))
})

// ----------------
// Fonctions

/**
 * Gère la présence d'un enfant
 * @param enfant L'enfant a modifier
 * @param isPresent Le status de présence de l'enfant
 */
async function handleAttendance(enfant: Enfant, isPresent: boolean) {
  const slot = getTodaySlot(enfant)

  if (!slot) {
    console.error("Aucun slot trouvé pour aujourd'hui")
    return
  }

  enfant.present = isPresent
  await setAttendance(slot.periodeId, slot.id, isPresent)
}

/**
 * Cherche si un enfant as un slot correspondant à aujourd'hui
 * @param enfant L'enfant interrogé
 */
function getTodaySlot(enfant: Enfant) {
  const today = new Date()

  return (
    enfant.slots.find((slot) => {
      const slotDate = new Date(slot.day)
      return (
        slotDate.getFullYear() === today.getFullYear() &&
        slotDate.getMonth() === today.getMonth() &&
        slotDate.getDate() === today.getDate()
      )
    }) ?? null
  )
}

/**
 * Trouve si l'enfant est présent ce jour, faux en cas de problème
 * @param enfant L'enfant interrogé
 */
function isChildPresentToday(enfant: Enfant): boolean {
  const slot = getTodaySlot(enfant)
  return slot?.isChildPresent ?? false
}

// ---------------------------------------
// CRUD
// NOTE: Pas de la gestion d'enfants, alors inutile de mettre bien plus d'informations

/**
 * Renvoie sur la page d'edition d'un enfant
 */
function gotoChildEdit(childID: string) {
  router.push({
    name: 'childEdit',
    query: {
      childId: childID,
    },
  })
}
</script>
