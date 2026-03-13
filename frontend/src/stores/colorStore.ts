import { defineStore } from "pinia"

interface ColorState {
  colorTheme: string | null
  colorAccent: string | null
}

export const useColorStore = defineStore("color", {
  state: (): ColorState => ({
    colorTheme: localStorage.getItem("colorTheme") || null,
    colorAccent: localStorage.getItem("colorAccent") || null,
  }),

  actions: {
    setColorTheme(theme: string) {
      this.colorTheme = theme
      localStorage.setItem("colorTheme", theme)
    },

    setColorAccent(accent: string) {
      this.colorAccent = accent
      localStorage.setItem("colorAccent", accent)

    },

    clearColorTheme() {
      this.colorTheme = null
      localStorage.removeItem("colorTheme")
    },

    clearColorAccent() {
      this.colorAccent = null
      localStorage.removeItem("colorAccent")
    }

  },
})
