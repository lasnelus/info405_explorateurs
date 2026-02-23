import { defineStore } from "pinia"

interface AuthState {
  accessToken: string | null
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    accessToken: localStorage.getItem("access_token"),
  }),

  actions: {
    setAccessToken(token: string) {
      this.accessToken = token
      localStorage.setItem("access_token", token)
    },

    clearAccessToken() {
      this.accessToken = null
      localStorage.removeItem("access_token")
    },
  },
})