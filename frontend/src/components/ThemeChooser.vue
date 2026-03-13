<template>
  <div class="
    mb-5
    justify-self-end
    flex
    flex-col

  ">
  <!-- Theme -->
  <span class="flex justify-center font-light">Theme</span>
  <div
    class="
      flex
      justify-center
      my-0.5
    "
    >
      <button
      @click="changeTheme('dark')"
      class="
        w-6 h-6
        bg-gray-900
        border-2 border-text
        rounded-full
        cursor-pointer
        mx-1.5
      "
      ></button>
      <button
      @click="changeTheme('light')"
      class="
        w-6 h-6
        bg-gray-100
        border-2 border-text
        rounded-full
        cursor-pointer
        mx-1.5
      "
      ></button>
    </div>

    <!-- Accent -->
    <span class="flex justify-center font-light mt-3">Couleur d'accent</span>
    <div
    class="
      flex
      justify-center
      my-0.5
    ">
      <button
      @click="changeAccent('bleu')"
      class="
        w-6 h-6
        bg-[#3A7CA5]
        border-2 border-text
        rounded-full
        cursor-pointer
        mx-1.5
      "
      ></button>
      <button
      @click="changeAccent('vert')"
      class="
        w-6 h-6
        bg-[#7FB3A2]
        border-2 border-text
        rounded-full
        cursor-pointer
        mx-1.5
      "
      ></button>
      <button
      @click="changeAccent('jaune')"
      class="
        w-6 h-6
        bg-[#F1C453]
        border-2 border-text
        rounded-full
        cursor-pointer
        mx-1.5
      "
      ></button>
      <button
      @click="changeAccent('rouge')"
      class="
        w-6 h-6
        bg-[#E07A5F]
        border-2 border-text
        rounded-full
        cursor-pointer
        mx-1.5
      "
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useColorStore } from '@/stores/colorStore'

// ----
// Gestion des thèmes
// ----

function changeTheme(theme : string) {

  // Récup des thèmes stoqués
  const color = useColorStore()

  const oldTheme  = color.colorTheme

  // Modification du store après récup
  color.setColorTheme(theme)

  // Vérification additionelle si le theme ne change pas, on ne fait rien.
  if (theme != oldTheme) {
    // Si le theme est set dans le colorStore (elle existe donc dans l'app), on se permet d'enlever la couleur du body
    if (oldTheme != null) {
      document.body.classList.remove(oldTheme)
    }
    document.body.classList.add(theme)
  }
}

function changeAccent(accent : string) {

  // Récup des thèmes stoqués
  const color = useColorStore()

  const oldAccent = color.colorAccent

  // Modification du store après récup
  color.setColorAccent(accent)

  // Vérification additionelle si l'accent ne change pas, on ne fait rien.
  if (accent != oldAccent) {
    if (oldAccent != null) {
      document.body.classList.remove(oldAccent)
    }
    document.body.classList.add(accent)
  }
}
</script>
