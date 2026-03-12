<template>
  <div v-if="profile">

    <h1>Inscription</h1>

    <p>{{ activity }} • {{ date }}</p>

    <p>
      Parent : {{ profile.firstName }} {{ profile.lastName }}
    </p>

    <p>
      Email : {{ profile.email }}
    </p>

    <button @click="submitRegistration">
      Confirmer
    </button>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { getProfile } from "@/services/authUser"

const route = useRoute()

const activity = route.query.activity
const date = route.query.date

const profile = ref()

onMounted(async () => {
  profile.value = await getProfile()
  profile.value = profile.value.data
})

function submitRegistration() {
  console.log({
    activity,
    date,
    parentId: profile.value.id
  })
}
</script>
