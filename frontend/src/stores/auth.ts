import { defineStore } from "pinia"

interface AuthState {
  accessToken: string | null
  profile: string | null
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    accessToken: null,
    profile: null,
  }),

  actions: {
    setAccessToken(token: string) {
      this.accessToken = token
    },

    clearAccessToken() {
      this.accessToken = null
    },

    setProfile(profile: any) {
      this.profile = JSON.stringify(profile)
    },

    clearProfile() {
      this.profile = null
    }

  },
})
