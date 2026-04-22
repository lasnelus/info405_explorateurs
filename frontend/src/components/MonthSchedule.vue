<template>
  <div class="
    max-w-4xl
    mx-auto
    px-6
    py-12

    bg-primary/10
    rounded-lg
    shadow-lg
    shadow-primary/15
    ">
    <h2 class="color-primary text-3xl font-bold mb-8">
      Agenda mensuel des activités
    </h2>

    <!-- Controls -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <button @click="prevMonth" class="px-3 py-1 rounded bg-primary text-primary-light">◀</button>
        <div class="font-semibold text-lg color-primary">{{ displayMonthLabel }}</div>
        <button @click="nextMonth" class="px-3 py-1 rounded bg-primary text-primary-light">▶</button>
      </div>

      <div class="w-1/3">
        <label class="color-primary block text-sm font-semibold mb-2">Groupe</label>
        <select
          v-model="selectedGroup"
          class="w-full px-4 py-2 h-10 border border-secondary rounded-lg"
        >
          <option v-for="group in groups" :key="group">{{ group }}</option>
        </select>
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7 gap-2 bg-transparent">
      <div v-for="(wd, i) in weekDays" :key="i" class="text-sm font-semibold color-primary text-center py-2">
        {{ wd }}
      </div>

      <div
        v-for="(cell, idx) in monthGrid"
        :key="idx"
        class="min-h-[80px] p-2 rounded-lg bg-primary-background/50 border border-transparent hover:border-secondary"
      >
        <div class="flex items-start justify-between">
          <div :class="{'text-text/50': cell.isOtherMonth}">{{ cell.date.getDate() }}</div>
          <div class="text-xs text-text/50">&nbsp;</div>
        </div>

        <div class="mt-2 space-y-1">
          <template v-for="(activity, aIdx) in getActivities(cell.date)" :key="aIdx">
            <div
              @click="goToRegistration(activity)"
              class="text-xs p-1 rounded bg-primary-100/50 truncate cursor-pointer hover:opacity-90"
            >
              {{ activity.title }}
            </div>
          </template>
        </div>
      </div>
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
const displayDate = ref(new Date(today.getFullYear(), today.getMonth(), 1))

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
  displayDate.value.toLocaleString("fr-FR", { month: "long", year: "numeric" })
)

function prevMonth() {
  const d = new Date(displayDate.value)
  d.setMonth(d.getMonth() - 1)
  displayDate.value = new Date(d.getFullYear(), d.getMonth(), 1)
}

function nextMonth() {
  const d = new Date(displayDate.value)
  d.setMonth(d.getMonth() + 1)
  displayDate.value = new Date(d.getFullYear(), d.getMonth(), 1)
}

const monthGrid = computed(() => {
  const year = displayDate.value.getFullYear()
  const month = displayDate.value.getMonth()
  const first = new Date(year, month, 1)

  // Monday = 0 for our grid
  const startOffset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7

  const cells: Array<{ date: Date; isOtherMonth: boolean }> = []
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startOffset + 1
    const cellDate = new Date(year, month, dayNum)
    cells.push({ date: cellDate, isOtherMonth: cellDate.getMonth() !== month })
  }

  return cells
})

function toLocalDate(dateInput: Date | string) {
  if (typeof dateInput === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [year, month, day] = dateInput.split("-").map(Number)
    return new Date(year, month - 1, day)
  }

  const date = new Date(dateInput)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
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
    const parts = s.split("-").map(p => Number(p.trim()))
    const min = Number.isFinite(parts[0]) ? parts[0] : 0
    const max = Number.isFinite(parts[1]) ? parts[1] : 999
    return [min, max]
  }

  const [selectedMin, selectedMax] = parseGroupRange(selectedGroup.value)

  const matches = periods.value
    .filter(p => {
      const first = toLocalDate(p.firstDay)
      const last = toLocalDate(p.lastDay)

      const inRange = current >= first && current <= last
      const groupMatch = p.ageMax >= selectedMin && p.ageMin <= selectedMax
      return inRange && groupMatch
    })
    .map(p => ({
      id: p.id,
      date: dateStr,
      group: `${p.ageMin}-${p.ageMax}`,
      title: `Période ${p.ageMin}-${p.ageMax}`,
      description: `Du ${formatDate(p.firstDay)} au ${formatDate(p.lastDay)} (capacité ${p.capacity})`
    }))

  return matches
}

// navigation vers l'inscription
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