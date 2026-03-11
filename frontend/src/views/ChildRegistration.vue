<template>
  <div class="min-h-screen bg-gray-50 py-12 px-6">

    <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">

      <h1 class="text-3xl font-bold mb-2">
        Inscription à une activité
      </h1>

      <p class="text-gray-600 mb-6">
        {{ activity }} • {{ date }}
      </p>

      <!-- Enfant -->

      <select v-model="selectedChildId" class="input">

        <option disabled value="">
          Sélectionner un enfant
        </option>

        <option
          v-for="child in children"
          :key="child.id"
          :value="child.id"
        >
          {{ child.firstName }} {{ child.lastName }}
        </option>

      </select>


      <div v-if="selectedChild" class="mt-4">
        <p><strong>Prénom :</strong> {{ selectedChild.firstName }}</p>
        <p><strong>Nom :</strong> {{ selectedChild.lastName }}</p>
        <p><strong>Date de naissance :</strong> {{ selectedChild.birthDate }}</p>
      </div>
      <!-- Infos parent -->

      <div v-if="parent" class="mt-6">
        <p><strong>Parent :</strong> {{ parent.name }}</p>
        <p><strong>Email :</strong> {{ parent.email }}</p>
      </div>

      <button
        class="btn-primary mt-8"
        @click="submitRegistration"
      >
        Confirmer l'inscription
      </button>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { getProfile } from "@/services/authUser"   // ton fichier

const route = useRoute()

const activity = route.query.activity
const date = route.query.date

const user = ref<any>(null)
const children = ref<any[]>([])
const selectedChildId = ref("")

onMounted(async () => {

  const profile = await getProfile()

  user.value = profile

  // récupérer tous les enfants depuis les familles
  children.value = profile.families.flatMap((family:any) =>
    family.children ?? []
  )
})

const parent = computed(() => {
  if (!user.value) return null
  return {
    name: user.value.firstName + " " + user.value.lastName,
    email: user.value.email
  }
})

const selectedChild = computed(() =>
  children.value.find(c => c.id === selectedChildId.value)
)

function submitRegistration(){

  if (!selectedChild.value) return

  const registration = {
    activity,
    date,
    childId: selectedChild.value.id,
    parentId: user.value.id
  }

  console.log("Inscription envoyée", registration)

}
</script>
