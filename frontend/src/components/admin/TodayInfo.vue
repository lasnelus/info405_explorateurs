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
                <td>{{ enfant.foodConstraint == 'NONE' ? 'N/A' : enfant.foodConstraint }}</td>

                <td class="p-0!">
                  <label class="flex justify-center items-center cursor-pointer w-1/2">
                    <input
                      type="checkbox"
                      :checked="isChildPresentToday(enfant)"
                      @change="handleAttendance(enfant, ($event.target as HTMLInputElement).checked)"
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
                      <p>Editer un enfant</p>
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
              <th scope="col">ID_repas</th>
              <th scope="col">type</th>
              <th scope="col">nb unit</th>
              <th scope="col">REGIME SPECIAL ?</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="repasAujourdhui.length > 0">
              <tr v-for="(repas, index) in repasAujourdhui" :key="index">
                <th scope="row">{{ repas.id_repas }}</th>
                <td>{{ repas.type }}</td>
                <td>{{ repas.nb_unit }}</td>
                <td>{{ repas.regime_special }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="6" class="p-8 text-center text-text font-medium italic">
                  Aucun repas n'est présent pour cette date.
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { setAttendance } from '@/services/activityServices'
// Test data
// const enfantsAujourdhui = ref([
//   { id_enfant: 'enf001', nom: 'VERSTAPPEN', prenom: 'Max', regime_special: 'non', present: true },
//   { id_enfant: 'enf002', nom: 'HAMILTON', prenom: 'Lewis', regime_special: 'non', present: true },
//   { id_enfant: 'enf003', nom: 'LECLERC', prenom: 'Charles', regime_special: 'non', present: false },
//   {
//     id_enfant: 'enf004',
//     nom: 'NORRIS',
//     prenom: 'Lando',
//     regime_special: 'vegetarien',
//     present: true,
//   },
//   {
//     id_enfant: 'enf005',
//     nom: 'RUSSELL',
//     prenom: 'George',
//     regime_special: 'sans_gluten',
//     present: true,
//   },
//   { id_enfant: 'enf006', nom: 'ALONSO', prenom: 'Fernando', regime_special: 'non', present: false },
// ])

interface Repas {
  id_repas: string
  type: string
  nb_unit: number
  regime_special: string
}

const repasAujourdhui = ref<Repas[]>([])

const router = useRouter()

const roleUser = await role()

interface Slot {
  id: string
  childId: string
  periodeId: string
  day: string
  isChildPresent: boolean
  createdAt: string
  updatedAt: string
}

interface Enfant {
  id: string
  firstName: string
  lastName: string
  foodConstraint: string
  present: boolean
  slots: Slot[]
}

defineProps<{
  todayChilds: Enfant[]
}>()

async function handleAttendance(enfant: Enfant, isPresent: boolean) {
  const slot = getTodaySlot(enfant)

  if (!slot) {
    console.error("Aucun slot trouvé pour aujourd'hui")
    return
  }

  enfant.present = isPresent
  await setAttendance(slot.periodeId, slot.id, isPresent)
}

function getTodaySlot(enfant: Enfant) {
  const today = new Date()

  return enfant.slots.find(slot => {
    const slotDate = new Date(slot.day)
    return (
      slotDate.getFullYear() === today.getFullYear() &&
      slotDate.getMonth() === today.getMonth() &&
      slotDate.getDate() === today.getDate()
    )
  }) ?? null
}

function isChildPresentToday(enfant: Enfant): boolean {
  const slot = getTodaySlot(enfant)
  return slot?.isChildPresent ?? false
}

function gotoChildEdit(childID: string) {
  router.push({
    name: 'childEdit',
    query: {
      childId: childID,
    },
  })
}
</script>
