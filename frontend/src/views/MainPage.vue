<template>
  <div class="min-h-screen">
    <div class="relative h-96 text-black overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center px-6">
          <p class="text-lg md:text-xl max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-12 bg-grey-100 rounded-lg shadow-lg">
      <!-- Agenda Section -->
      <section class="mb-12">
        <h2 class="color-primary text-3xl font-bold mb-8">Agenda des activités</h2>

        <!-- Filters -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label class="color-primary block text-sm font-semibold mb-2">Âge</label>
            <select class="border-secondary w-full px-4 py-2 border rounded-lg">
              <option>8-12</option>
              <option>13-17</option>
              <option>18+</option>
            </select>
          </div>
          <div>
            <label class="color-primary block text-sm font-semibold mb-2">Semaine</label>
            <select class="border-secondaryw-full px-4 py-2 border rounded-lg">
              <option>01/02/25</option>
              <option>08/02/25</option>
              <option>15/02/25</option>
            </select>
          </div>
        </div>

        <!-- Schedule Cards -->
        <div class="space-y-4">
          <!-- Lundi -->
          <div class="bg-white rounded-lg p-6 shadow-md">
            <h3 class="font-bold mb-3 text-lg color-primary">Lundi</h3>
            <div class="space-y-2">
              <div class="h-3 rounded bg-primary" style="width: 40%"></div>
              <div class="h-3 rounded bg-secondary" style="width: 60%"></div>
              <div class="h-3 rounded bg-primary" style="width: 30%"></div>
            </div>
          </div>

          <!-- Mardi -->
          <div class="bg-white rounded-lg p-6 shadow-md">
            <h3 class="font-bold mb-3 text-lg color-primary">Mardi</h3>
            <div class="space-y-2">
              <div class="h-3 rounded bg-primary" style="width: 50%"></div>
              <div class="h-3 rounded bg-secondary" style="width: 75%"></div>
              <div class="h-3 rounded bg-primary" style="width: 55%"></div>
              <div class="h-3 rounded bg-secondary" style="width: 80%"></div>
            </div>
          </div>

          <!-- Mercredi -->
          <div class="bg-white rounded-lg p-6 shadow-md">
            <h3 class="font-bold mb-3 text-lg color-primary">Mercredi</h3>
            <div class="space-y-2">
              <div class="h-3 rounded bg-primary" style="width: 65%"></div>
              <div class="h-3 rounded bg-secondary" style="width: 45%"></div>
              <div class="h-3 rounded bg-primary" style="width: 70%"></div>
            </div>
          </div>

          <!-- Jeudi -->
          <div class="bg-white rounded-lg p-6 shadow-md">
            <h3 class="font-bold mb-3 text-lg color-primary">Jeudi</h3>
            <div class="space-y-2">
              <div class="h-3 rounded bg-primary" style="width: 35%"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="max-w-4xl mx-auto px-6 py-12 bg-green-100 rounded-lg shadow-lg mt-12">
      <!-- Contact Section -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold mb-6 color-primary">Nous contacter</h2>

        <div class="space-y-6">
          <!-- Address -->
          <div>
            <h3 class="font-semibold mb-2 color-primary">Adresse physique</h3>
            <p class="text-gray-700">CPostal Commune</p>
          </div>

          <!-- Hours -->
          <div>
            <h3 class="font-semibold mb-2 color-primary">Horaires</h3>
            <ul class="text-gray-700 space-y-1">
              <li>lundi - 8h/18h</li>
              <li>mardi - 8h/18h</li>
              <li>mercredi - 8h/18h</li>
              <li>jeudi - 8h/18h</li>
              <li>vendredi - 8h/18h</li>
            </ul>
          </div>

          <!-- Phone -->
          <div>
            <h3 class="font-semibold mb-2 color-primary">Contact</h3>
            <p class="text-gray-700">random@explorateurs-explorateurs.fr</p>
            <p class="text-gray-700">01 - 72 - 45 - 92 - 50</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
select {
  background-color: white;
  color: #333;
}

select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(46, 125, 158, 0.1);
}
</style>
