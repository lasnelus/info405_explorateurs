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

    <div>
      <select v-model="selectedOption">
        <option v-for="child in options" :key="child.id" :value="child.value">
          {{ child.label }}
        </option>
      </select>

    </div>
    <button @click="submitRegistration">
      Confirmer
    </button>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { getFamily} from "@/services/familyServices"
import router from "@/router"


const route = useRoute()
const auth = useAuthStore()

const activity = route.query.activity
const date = route.query.date

const profile = JSON.parse(auth.profile)

const selectedOption = ref("")

const options = ref<Array<{ id: string; label: string; value: string }>>([])
async function fetchChildren() {
  const childrenList: Array<{ id: string; label: string; value: string }> = []
  for (const family of profile.families) {
    try {
      const familyData = await getFamily(family.id)


      if (familyData.data.childs) {
        familyData.data.childs.forEach((child: any) => {
          childrenList.push({
            id: child.id,
            label: `${child.firstName} ${child.lastName} (${family.name})`,
            value: child.id
          })
        })
      }
    } catch (error) {
      console.error(`Erreur lors du chargement des enfants pour la famille ${family.id}`, error)
    }
  }

  options.value = childrenList
}

function submitRegistration() {
  console.log("Enfant choisi :", selectedOption.value)
}

onMounted(async () => {
  if (profile) {
    await fetchChildren()
  } else {
    router.push('/login')
  }
})
</script>
