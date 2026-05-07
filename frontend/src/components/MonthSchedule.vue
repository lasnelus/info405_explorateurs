<template>
  <div
    class="
      max-w-6xl
      mx-auto
      px-3 sm:px-6
      py-6 sm:py-10

      bg-primary/10
      rounded-2xl
      shadow-xl
      shadow-primary/10
      backdrop-blur
    "
  >
    <!-- Header -->
    <div
      class="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-5
        mb-8
      "
    >
      <div>
        <h2 class="color-primary text-2xl sm:text-3xl font-bold">
          Agenda mensuel des activités
        </h2>

        <p class="text-sm text-text/70 mt-1">
          Consultez les périodes disponibles par tranche d’âge
        </p>
      </div>

      <!-- Controls -->
      <div
        class="
          flex
          flex-col
          sm:flex-row
          gap-4
          sm:items-end
          w-full
          lg:w-auto
        "
      >
        <!-- Month navigation -->
        <div
          class="
            flex
            items-center
            justify-between
            sm:justify-start
            gap-3
          "
        >
          <button
            @click="prevMonth"
            class="
              h-11
              w-11
              flex
              items-center
              justify-center
              rounded-full
              bg-primary
              text-primary-light
              hover:scale-105
              active:scale-95
              transition
              shadow-md
              cursor-pointer
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div
            class="
              min-w-[150px]
              text-center
              font-semibold
              text-lg
              sm:text-xl
              capitalize
              color-primary
            "
          >
            {{ displayMonthLabel }}
          </div>

          <button
            @click="nextMonth"
            class="
              h-11
              w-11
              flex
              items-center
              justify-center
              rounded-full
              bg-primary
              text-primary-light
              hover:scale-105
              active:scale-95
              transition
              shadow-md
              cursor-pointer
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <!-- Group select -->
        <div class="w-full sm:min-w-[220px]">
          <label class="color-primary block text-sm font-semibold mb-2">
            Groupe
          </label>

          <select
            v-model="selectedGroup"
            class="
              w-full
              px-4
              py-3
              border
              border-secondary/40
              rounded-xl
              bg-white/80
              backdrop-blur
              shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-primary/40
            "
          >
            <option
              v-for="group in groups"
              :key="group"
            >
              {{ group }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Calendar -->
    <div class="overflow-x-auto">
      <div class="min-w-[720px]">
        <!-- Week days -->
        <div class="grid grid-cols-7 gap-2 mb-2">
          <div
            v-for="(wd, i) in weekDays"
            :key="i"
            class="
              text-xs
              sm:text-sm
              font-bold
              color-primary
              text-center
              py-3
              rounded-xl
              bg-primary/5
            "
          >
            {{ wd }}
          </div>
        </div>

        <!-- Days -->
        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="(cell, idx) in monthGrid"
            :key="idx"
            class="
              min-h-[110px]
              sm:min-h-[130px]
              p-2
              sm:p-3
              rounded-2xl
              transition-all
              duration-200

              border
              border-primary/5

              hover:border-secondary/40
              hover:shadow-lg
              hover:-translate-y-0.5

              bg-white/60
              backdrop-blur
            "
            :class="{
              'opacity-40 bg-transparent': cell.isOtherMonth
            }"
          >
            <!-- Day number -->
            <div class="flex items-center justify-between">
              <div
                class="
                  text-sm
                  sm:text-base
                  font-semibold
                "
              >
                {{ cell.date.getDate() }}
              </div>
            </div>

            <!-- Activities -->
            <div class="mt-2 flex flex-col gap-1.5">
              <template
                v-for="(activity, aIdx) in getActivities(cell.date)"
                :key="aIdx"
              >
                <button
                  @click="goToRegistration(activity)"
                  class="
                    text-left
                    text-[11px]
                    sm:text-xs

                    px-2
                    py-1.5

                    rounded-lg

                    bg-primary/15
                    hover:bg-primary
                    hover:text-white

                    transition
                    duration-200

                    truncate
                    cursor-pointer
                  "
                >
                  {{ activity.title }}
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile hint -->
    <div class="sm:hidden text-xs text-text/60 mt-4 text-center">
      Faites glisser horizontalement pour voir tout le calendrier
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getActivities as fetchPeriods } from "@/services/activityServices"

interface Period {
  id: string
  ageMin: number
  ageMax: number
  capacity: number
  firstDay: string
  lastDay: string
}

interface Activity {
  id: string
  date: string
  group: string
  title: string
  description: string
}

const periods = ref<Period[]>([])

const today = new Date()
const displayDate = ref(
  new Date(today.getFullYear(), today.getMonth(), 1)
)

const selectedGroup = ref("6-10")
const groups = ["6-10", "8-12", "13-17", "18+"]

const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

onMounted(async () => {
  try {
    const response = await fetchPeriods()

    if (response?.data && Array.isArray(response.data)) {
      periods.value = response.data
    }
  } catch (error) {
    console.error("Erreur chargement des périodes :", error)
  }
})

const displayMonthLabel = computed(() =>
  displayDate.value.toLocaleString("fr-FR", {
    month: "long",
    year: "numeric",
  })
)

function prevMonth() {
  const d = new Date(displayDate.value)
  d.setMonth(d.getMonth() - 1)

  displayDate.value = new Date(
    d.getFullYear(),
    d.getMonth(),
    1
  )
}

function nextMonth() {
  const d = new Date(displayDate.value)
  d.setMonth(d.getMonth() + 1)

  displayDate.value = new Date(
    d.getFullYear(),
    d.getMonth(),
    1
  )
}

const monthGrid = computed(() => {
  const year = displayDate.value.getFullYear()
  const month = displayDate.value.getMonth()

  const first = new Date(year, month, 1)

  // Monday = 0
  const startOffset = (first.getDay() + 6) % 7

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate()

  const totalCells =
    Math.ceil((startOffset + daysInMonth) / 7) * 7

  const cells: Array<{
    date: Date
    isOtherMonth: boolean
  }> = []

  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startOffset + 1

    const cellDate = new Date(year, month, dayNum)

    cells.push({
      date: cellDate,
      isOtherMonth: cellDate.getMonth() !== month,
    })
  }

  return cells
})

function toLocalDate(dateInput: Date | string) {
  if (
    typeof dateInput === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(dateInput)
  ) {
    const [year, month, day] = dateInput
      .split("-")
      .map(Number)

    return new Date(year, month - 1, day)
  }

  const date = new Date(dateInput)

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
}

function formatISODateLocal(date: Date) {
  const year = date.getFullYear()

  const month = String(date.getMonth() + 1).padStart(2, "0")

  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function getActivities(day: Date) {
  const current = toLocalDate(day)
  const dateStr = formatISODateLocal(current)

  if (!dateStr) return []

  function parseGroupRange(rangeStr: string) {
    if (!rangeStr) return [0, 999]

    const s = rangeStr.trim()

    if (s.includes("+")) {
      const min = parseInt(s.replace("+", ""), 10)

      return [Number.isFinite(min) ? min : 0, 999]
    }

    const parts = s.split("-").map((p) => Number(p.trim()))

    const min = Number.isFinite(parts[0]) ? parts[0] : 0
    const max = Number.isFinite(parts[1]) ? parts[1] : 999

    return [min, max]
  }

  const [selectedMin, selectedMax] = parseGroupRange(
    selectedGroup.value
  )

  return periods.value
    .filter((p) => {
      const first = toLocalDate(p.firstDay)
      const last = toLocalDate(p.lastDay)

      const inRange =
        current >= first && current <= last

      const groupMatch =
        p.ageMax >= selectedMin &&
        p.ageMin <= selectedMax

      return inRange && groupMatch
    })
    .map((p) => ({
      id: p.id,
      date: dateStr,
      group: `${p.ageMin}-${p.ageMax}`,
      title: `Période ${p.ageMin}-${p.ageMax}`,
      description: `Du ${formatDate(
        p.firstDay
      )} au ${formatDate(p.lastDay)} (capacité ${
        p.capacity
      })`,
    }))
}

const router = useRouter()

function goToRegistration(activity: Activity) {
  router.push({
    name: "inscription",
    query: {
      periodId: activity.id,
      date: activity.date,
    },
  })
}
</script>