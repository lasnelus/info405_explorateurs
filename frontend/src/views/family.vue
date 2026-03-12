<template>
  <div class="create-family">
    <h2>Créer une famille</h2>

    <form @submit.prevent="handleCreation">
      <div>
        <label>Nom de la famille</label>
        <input v-model="name" type="text" placeholder="Nom..." required />
      </div>

      <button type="submit">Créer</button>
    </form>

    <p v-if="error" style="color:red">{{ error }}</p>
    <p v-if="success" style="color:green">Famille créée !</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { getProfile } from "@/services/authUser"
import { createFamily } from "@/services/familyServices"

const name = ref("")
const error = ref("")
const success = ref(false)


const handleCreation = async () => {
  try {
    error.value = ""

    await createFamily(name.value, id.value)

    success.value = true
    name.value = ""

    // optionnel : rediriger
    // router.push("/dashboard")

  } catch (err) {
    error.value = "Erreur lors de la création de la famille"
    console.error(err)
  }
}

const id = ref("")

onMounted(async () => {
  const res = await getProfile()
  id.value = res.data.id
  console.log(id.value)
})
</script>