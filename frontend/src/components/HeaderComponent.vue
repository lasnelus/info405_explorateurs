<template>
  <header class="bg-primary text-black shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

      <!-- LOGO -->
      <router-link to="/" class="flex items-center cursor-pointer">
        <img src="../assets/logoexplorateurV2.1.png" class="h-16 w-auto object-contain" alt="Logo" />
      </router-link>

      <!-- BOUTON BURGER SI CONNECTÉ -->
      <button
        v-if="isLoggedIn"
        @click="toggleMenu"
        class="flex flex-col gap-1 w-8 hover:cursor-pointer"
      >
        <span class="h-1 bg-secondary rounded"></span>
        <span class="h-1 bg-secondary rounded"></span>
        <span class="h-1 bg-secondary rounded"></span>
      </button>

      <!-- BOUTON LOGIN SI PAS CONNECTÉ -->
      <router-link
        v-else
        to="/login"
        class="bg-secondary px-5 py-2 rounded-full font-semibold"
      >
        Connexion
      </router-link>
    </div>
  </header>

  <!-- OVERLAY -->
  <div
    v-if="menuOpen"
    class="fixed inset-0 bg-black/30 z-40 transition-all duration-300 "
    @click="closeMenu"
  ></div>

  <!-- MENU LATÉRAL -->
  <aside
    class="
    fixed top-0
    right-0
    h-full
    w-64
    bg-primary-background
    shadow-xl
    z-50
    transform
    transition-transform
    duration-300"
    :class="menuOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="p-6 flex flex-col justify-between gap-6 h-full">
      <nav class="flex flex-col gap-4 font-semibold text-lg">
        <router-link to="/family-dashboard" @click="closeMenu" class="
          -my-1
          py-1
          text-center
          rounded-3xl
          duration-300
          text-text
          bg-primary/25
          hover:bg-primary/50
        ">Ma famille</router-link>
        <router-link to="/" @click="closeMenu" class="
          -my-1
          py-1
          text-center
          rounded-3xl
          duration-300
          text-text
          bg-primary/25
          hover:bg-primary/50
        ">lorem ipsum</router-link>
        <router-link to="/" @click="closeMenu" class="
          -my-1
          py-1
          text-center
          rounded-3xl
          duration-300
          text-text
          bg-primary/25
          hover:bg-primary/50
        ">lorem ipsum</router-link>
        <router-link to="/" @click="closeMenu" class="
          -my-1
          py-1
          text-center
          rounded-3xl
          duration-300
          text-text
          bg-primary/25
          hover:bg-primary/50
        ">Inscrire un enfant</router-link>

        <div class="mt-auto">
          <button
            @click="logout"
            class="block w-full text-center bg-red-500 text-white py-3 rounded-full font-semibold cursor-pointer
             duration-300 shadow-md shadow-primary-background transition-all
            hover:scale-105 hover:shadow-lg hover:shadow-red-500/50
            "
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <!-- THEME & ACCENT -->
      <div class="
        mb-5
        justify-self-end
        flex
        flex-col

      ">
      <!-- Theme -->
        <div>
          <button
          @click="changeTheme('dark')"
          >
            Sombre
          </button>
          <button
          @click="changeTheme('light')"
          >
            Clair
          </button>
        </div>

        <!-- Accent -->
        <div>
          <button
          @click="changeAccent('bleu')"
          >
            Bleu
          </button>
          <button
          @click="changeAccent('vert')"
          >
            Vert
          </button>
          <button
          @click="changeAccent('jaune')"
          >
            Jaune
          </button>
          <button
          @click="changeAccent('rouge')"
          >
            Rouge
          </button>
        </div>

      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { useColorStore } from "@/stores/colorStore"

const router = useRouter()
const auth = useAuthStore()

const menuOpen = ref(false)

const isLoggedIn = computed(() => {
  return !!auth.profile
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function logout() {
  auth.clearAccessToken()
  closeMenu()
  router.push("/login")
}

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
