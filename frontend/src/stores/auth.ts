import { defineStore } from "pinia"

interface AuthState {
  accessToken: string | null
  profile: string | null
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    accessToken: localStorage.getItem("access_token"),
    profile: sessionStorage.getItem("profile"),
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

    setProfile(profile: any) {
      this.profile = JSON.stringify(profile)
      sessionStorage.setItem("profile", JSON.stringify(profile))
    },

    clearProfile() {
      this.profile = null
      sessionStorage.removeItem("profile")
    }

  },
})