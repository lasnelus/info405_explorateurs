import axios, {
    type AxiosError,
    type AxiosRequestConfig,
    type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from "@/stores/auth"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

// Gestion du rafraîchissement du token d'accès
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}

function onRefreshFailed() {
  refreshSubscribers.forEach(cb => cb(''))
  refreshSubscribers = []
}


/* ===== Intercepteur REQUEST ===== */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const auth = useAuthStore()

    if (auth.accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

/* ===== Intercepteur RESPONSE ===== */
api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const auth = useAuthStore()
        const originalRequest = error.config as
            | (AxiosRequestConfig & { _retry?: boolean })
            | undefined

        // si l'erreur vient d'une requête de login ou de refresh, on ne tente pas de rafraîchir le token
        if (
            originalRequest?.url?.includes('/auth/login') ||
            originalRequest?.url?.includes('/auth/refresh')
        ) {
            return Promise.reject(error)
        }

        if (
            originalRequest &&
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true

            // si déjà en train de rafraîchir, on s'abonne pour être notifié quand le token est prêt et on
            // refait la requête originale avec le nouveau token
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((token: string) => {
                        if (!token) {
                            reject(error)
                            return
                        }
                        if (!originalRequest.headers) {
                            originalRequest.headers = {}
                        }
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        resolve(api(originalRequest))
                    })
                })
            }

            // sinon, on lance le rafraîchissement du token
            isRefreshing = true
            try {
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                )

                const newAccessToken = refreshResponse.data.accessToken
                auth.setAccessToken(newAccessToken)
                onRefreshed(newAccessToken)
                isRefreshing = false

                if (!originalRequest.headers) {
                    originalRequest.headers = {}
                }
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return api(originalRequest)
            } catch (refreshError) {
                onRefreshFailed()
                isRefreshing = false
                auth.clearAccessToken()
                window.location.href = "/"
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api
