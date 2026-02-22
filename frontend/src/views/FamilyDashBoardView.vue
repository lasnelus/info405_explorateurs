<template>
  <div class="min-h-screen" :style="{ backgroundColor: 'var(--color-background)' }">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <!-- Mes familles Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6 color-primary">Mes familles</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-white rounded-lg p-6 border-2 min-h-36 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all border-primary"
            @click="selectFamily(1)"
          >
            <span class="text-gray-400 text-center">Famille 1</span>
          </div>

          <div
            class="bg-white rounded-lg p-6 border-2 min-h-36 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all border-primary"
            @click="selectFamily(2)"
          >
            <span class="text-gray-400 text-center">Famille 2</span>
          </div>
        </div>
      </section>

      <!-- Activités à venir Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6 color-primary">Activités à venir</h2>

        <div class="space-y-3">
          <div
            class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border-l-4"
            :style="{ borderColor: 'var(--color-primary)' }"
          >
            <h3 class="font-semibold color-primary">LOREM IPSUM $(CHILDNAME)</h3>
            <p class="text-sm text-gray-600 mt-2">Activité prévu en attente de confirmation</p>
          </div>

          <div
            class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border-l-4 border-primary"
          >
            <h3 class="font-semibold color-primary">LOREM IPSUM $(CHILDNAME)</h3>
            <p class="text-sm text-gray-600 mt-2">Activité prévu en attente de confirmation</p>
          </div>

          <div
            class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border-l-4"
            :style="{ borderColor: 'var(--color-primary)' }"
          >
            <h3 class="font-semibold color-primary">LOREM IPSUM $(CHILDNAME)</h3>
            <p class="text-sm text-gray-600 mt-2">Activité prévu en attente de confirmation</p>
          </div>
        </div>
      </section>

      <!-- État des inscriptions Section -->
      <section>
        <h2 class="text-2xl font-bold mb-6 color-primary">État des inscriptions</h2>

        <div class="space-y-3">
          <div class="bg-white rounded-lg p-6 shadow-md border-l-4 border-secondary">
            <div class="flex justify-between items-center">
              <span class="font-semibold text-gray-800">$(CHILDNAME) $(STATE)</span>
              <span
                class="px-4 py-1 rounded-full text-sm font-semibold text-white bg-secondary"
              >
                Inscrit
              </span>
            </div>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-md border-l-4 border-secondary">
            <div class="flex justify-between items-center">
              <span class="font-semibold text-gray-800">$(CHILDNAME) $(STATE)</span>
              <span
                class="px-4 py-1 rounded-full text-sm font-semibold text-white bg-secondary"
              >
                En attente
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedFamily = ref<number | null>(null)

const selectFamily = (familyId: number) => {
  selectedFamily.value = familyId
  console.log('Family selected:', familyId)
}
</script>

<style scoped>
</style>
