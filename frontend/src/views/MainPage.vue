<template>
  <div class="min-h-screen">
    <div class="relative h-96 overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center px-6">
          <p class="text-lg md:text-xl max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
          </p>
        </div>
      </div>
    </div>

    <WeeklySchedule />

    <div class="
      max-w-4xl

      mx-auto
      mt-12
      px-6
      py-12

      bg-primary/10
      shadow-lg
      shadow-primary/15

      rounded-lg
      ">
      <!-- Contact Section -->
      <div class="
        bg-primary-background
        rounded-lg
        shadow-lg
        shadow-primary/15
        p-8
        ">
        <h2 class="
          text-2xl
          font-bold
          mb-6
          color-primary
        ">
          Nous contacter
        </h2>

        <div class="space-y-6">
          <!-- Address -->
          <div>
            <h3 class="font-semibold mb-2 color-primary">Adresse physique</h3>
            <p class="text-text/50">CPostal Commune</p>
          </div>

          <!-- Hours -->
          <div>
            <h3 class="font-semibold mb-2 color-primary">Horaires</h3>
            <ul class="text-text/50 space-y-1">
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
            <p class="
              text-text/50
            ">
              <a
              class="
                underline
                underline-offset-1
                decoration-2
                decoration-primary/50

                hover:text-primary
                hover:decoration-primary
                duration-300
              "
              href="mailto:random@explorateurs-explorateurs.fr">
                random@explorateurs-explorateurs.fr
              </a>
            </p>
            <p class="text-text/50">01 - 72 - 45 - 92 - 50</p> <!-- TODO "click to copy" -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WeeklySchedule from "@/components/WeeklySchedule.vue"
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
