<template>
  <div v-if="profile">

    <h1>Inscription</h1>

    <p>{{ activity }} • {{ date }}</p>
    <p>

    <p>
      Parent : {{ profile.firstName }} {{ profile.lastName }}
    </p>

      Email : {{ profile.email }}
    </p>

    <div>
      <select v-model="selectedOption">
        <option v-for="child in options" :key="child.id" :value="child.value">
          {{ child.label }}
        </option>
      </select>

      <p> Option choisie : {{ selectedOption}} </p>
    </div>

    <button @click="submitRegistration">
      Confirmer
    </button>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const route = useRoute()
const auth = useAuthStore()

const activity = route.query.activity
const date = route.query.date

const profile = JSON.parse(auth.profile)

function submitRegistration() {
}



// child de con

const selectedOption = ref("")


const options = ref([
  { id: 1, label: "Option 1", value: "opt1" },
  { id: 2, label: "Option 2", value: "opt2" },
  { id: 3, label: "Option 3", value: "opt3" }
])

</script>
