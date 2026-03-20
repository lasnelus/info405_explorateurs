// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref<string | null>(null)
    const profile = ref<any | null>(null)
    const isReady = ref(false)

    const isLoggedIn = computed(() => {
        if (accessToken.value != null) {
          return true
        }
        else {
          return false
        }
      }
    )


    function setAccessToken(token: string) {
        accessToken.value = token
    }

    function clearAccessToken() {
        accessToken.value = null
    }

    function setProfile(data: any) {
        profile.value = data
    }

    function clearProfile() {
        profile.value = null
    }

    function clear() {
        clearAccessToken()
        clearProfile()
    }

    async function init() {
        try {
            // Server validates the HttpOnly cookie and returns a fresh access token
            const { data } = await api.post<{ accessToken: string }>('/auth/refresh')
            setAccessToken(data.accessToken)
        } catch {
            clear()
        } finally {
            isReady.value = true
        }
    }

    return {
        accessToken,
        profile,
        isReady,
        isLoggedIn,
        setAccessToken,
        clearAccessToken,
        setProfile,
        clearProfile,
        clear,
        init,
    }
})

