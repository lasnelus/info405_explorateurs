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
      Agenda des activités
    </h2>
    <!-- Filters -->
    <div class="grid grid-cols-2 gap-4 mb-8">
      <div>
        <label class="color-primary block text-sm font-semibold mb-2">Semaine</label>
        <input
          type="week"
          v-model="selectedWeek"
          class="border-secondary w-full h-10 px-4 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label class="color-primary block text-sm font-semibold mb-2">Groupe</label>
        <select
          v-model="selectedGroup"
          class="
            w-full

            px-4
            py-2

            h-10

            border
            border-secondary

            rounded-lg
          ">
          <option v-for="group in groups" :key="group">
            {{ group }}
          </option>
        </select>
      </div>
    </div>

    <!-- Days -->
    <div class="space-y-4">
      <div
        v-for="(day, index) in weekDays"
        :key="index"
        class="bg-primary-background rounded-lg p-6 shadow-md shadow-primary/15"
      >
        <h3 class="font-bold mb-3 text-lg color-primary">
          {{ formatDay(day) }}
        </h3>
        <div class="space-y-3">
          <template v-if="getActivities(day).length">
            <div
              v-for="(activity,i) in getActivities(day)"
              :key="i"
              class="
                p-4
                rounded-lg
                bg-primary-100/25

                shadow-md
                shadow-primary/15
              "
            >
              <h4 class="font-semibold text-text">
                {{ activity.title }}
              </h4>
              <p class="text-sm text-text/50 my-1 mt-0.5">
                {{ activity.description }}
              </p>
              <button
                class="
                  btn-register
                  cursor-pointer

                  bg-primary
                  text-primary-light

                  px-2
                  my-0.5
                  rounded-2xl

                  select-none

                  hover:scale-105
                  hover:shadow-md
                  hover:shadow-primary-100/15
                  duration-300"
                @click="goToRegistration(activity)"
              >
                Inscrire un enfant
              </button>
            </div>
          </template>
          <template v-else>
            <p class="text-gray-500 italic">
              Aucune activité définie pour ce jour
            </p>
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

const selectedWeek = ref(getCurrentWeek())
const selectedGroup = ref("6-10")

const groups = ["6-10", "8-12", "13-17", "18+"]

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



function getCurrentWeek() {
  const date = new Date()
  const annee = new Date(date.getFullYear(),0,1)
  const week = Math.ceil((((date.getTime() - annee.getTime()) / 86400000) + annee.getDay()+1)/7)
  return `${date.getFullYear()}-W${week.toString().padStart(2,"0")}`
}

function getDaysOfWeek(weekStr:string) {
  const parts = weekStr.split("-W")
  const yearRaw = Number(parts[0])
  const weekRaw = Number(parts[1])
  const year = Number.isFinite(yearRaw) ? yearRaw : new Date().getFullYear()
  const week = Number.isFinite(weekRaw) ? weekRaw : 1

  const simple = new Date(year, 0, 1 + (week - 1) * 7)
  const dow = simple.getDay()

  const monday = new Date(simple)

  if(dow <=4)
    monday.setDate(simple.getDate()-simple.getDay()+1)
  else
    monday.setDate(simple.getDate()+8-simple.getDay())

  return Array.from({length:5},(_,i)=>{
    const d = new Date(monday)
    d.setDate(monday.getDate()+i)
    return d
  })
}

const weekDays = computed(()=>{
  return getDaysOfWeek(selectedWeek.value)
})



function getActivities(day:Date){
  const [dateStr] = day.toISOString().split("T")
  if (!dateStr) return []

  const selectedRange = selectedGroup.value.split("-").map(Number)
  const selectedMin = selectedRange[0] || 0
  const selectedMax = selectedRange[1] || 999

  const matches = periods.value
    .filter(p => {
      const first = new Date(p.firstDay)
      const last = new Date(p.lastDay)
      const current = new Date(dateStr)
      current.setHours(0,0,0,0)
      first.setHours(0,0,0,0)
      last.setHours(0,0,0,0)

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



function formatDay(day:Date){
  return day.toLocaleDateString("fr-FR",{
    weekday:"long",
    day:"numeric",
    month:"long"
  })
}

function formatDate(dateStr:string){
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}


// inscription des enfants à une activité
const router = useRouter()

function goToRegistration(activity: Activity){
  router.push({
    name: "inscription",
    query: {
      periodId: activity.id,
      date: activity.date
    }
  })
}
</script>
