<template>
  <div class="max-w-4xl mx-auto px-6 py-12 bg-grey-100 rounded-lg shadow-lg shadow-primary/15">
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
          class="border-secondary w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label class="color-primary block text-sm font-semibold mb-2">Groupe</label>
        <select
          v-model="selectedGroup"
          class="border-secondary w-full px-4 py-2 border rounded-lg"
        >
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
              class="p-4 rounded-lg bg-white border border-gray-200"
            >
              <h4 class="font-semibold text-gray-800">
                {{ activity.title }}
              </h4>
              <p class="text-sm text-gray-600 mt-1">
                {{ activity.description }}
              </p>
              <button
                class="btn-register"
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
import { ref, computed } from "vue"

// TODO : remplacer par une requete API

interface Activity {
  date: string
  group: string
  title: string
  description: string
}

const activities = ref<Activity[]>([
  {
    date: "2026-03-09",
    group: "8-12",
    title: "Atelier peinture",
    description: "Découverte de la peinture et création libre"
  },
  {
    date: "2026-03-10",
    group: "8-12",
    title: "Jeux extérieurs",
    description: "Jeux de groupe dans la cour"
  },
  {
    date: "2026-03-11",
    group: "13-17",
    title: "Initiation guitare",
    description: "Apprendre les premiers accords"
  }
])



const selectedWeek = ref(getCurrentWeek())
const selectedGroup = ref("8-12")

const groups = ["8-12", "13-17", "18+"]



function getCurrentWeek() {
  const date = new Date()
  const annee = new Date(date.getFullYear(),0,1)
  const week = Math.ceil((((date.getTime() - annee.getTime()) / 86400000) + annee.getDay()+1)/7)
  return `${date.getFullYear()}-W${week.toString().padStart(2,"0")}`
}

function getDaysOfWeek(weekStr:string) {

  const [year, week] = weekStr.split("-W").map(Number)

  const simple = new Date(year,0,1+(week-1)*7)
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

  const dateStr = day.toISOString().split("T")[0]

  return activities.value.filter(
    a =>
      a.date === dateStr &&
      a.group === selectedGroup.value
  )
}



function formatDay(day:Date){
  return day.toLocaleDateString("fr-FR",{
    weekday:"long",
    day:"numeric",
    month:"long"
  })
}



// inscription des enfants à une activité
import { useRouter } from "vue-router"

const router = useRouter()

function goToRegistration(activity:any){
  router.push({
    name: "inscription",
    query: {
      activity: activity.title,
      date: activity.date
    }
  })
}
</script>
