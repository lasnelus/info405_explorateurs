import axios, {
    type AxiosError,
    type AxiosRequestConfig,
    type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
})

// ─── Gestion du rafraîchissement du token ────────────────────────────────────

let isRefreshing = false
let refreshSubscribers: Array<{
    resolve: (token: string) => void
    reject: (err: unknown) => void
}> = []

function subscribeTokenRefresh(
    resolve: (token: string) => void,
    reject: (err: unknown) => void,
) {
    refreshSubscribers.push({ resolve, reject })
}

function onRefreshed(token: string) {
    refreshSubscribers.forEach(({ resolve }) => resolve(token))
    refreshSubscribers = []
}

function onRefreshFailed(err: unknown) {
    refreshSubscribers.forEach(({ reject }) => reject(err))
    refreshSubscribers = []
}

// ─── Intercepteur REQUEST ─────────────────────────────────────────────────────

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { accessToken } = useAuthStore()

        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
    },
    (error: AxiosError) => Promise.reject(error),
)

// ─── Intercepteur RESPONSE ────────────────────────────────────────────────────

const AUTH_URLS = ['/auth/login', '/auth/refresh']

api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const auth = useAuthStore()
        const originalRequest = error.config as
            | (AxiosRequestConfig & { _retry?: boolean })
            | undefined

        const isAuthUrl = AUTH_URLS.some(url => originalRequest?.url?.includes(url))

        if (isAuthUrl || !originalRequest || error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error)
        }

        originalRequest._retry = true

        // Un refresh est déjà en cours : on s'abonne et on attend le résultat
        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                subscribeTokenRefresh(resolve, reject)
            }).then(token => {
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${token}`,
                }
                return api(originalRequest)
            })
        }

        // On lance le refresh
        isRefreshing = true
        try {
            const { data } = await axios.post<{ accessToken: string }>(
                `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                {},
                { withCredentials: true },
            )

            auth.setAccessToken(data.accessToken)
            onRefreshed(data.accessToken)

            originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${data.accessToken}`,
            }
            return api(originalRequest)
        } catch (refreshError) {
            onRefreshFailed(refreshError)
            auth.clearAccessToken()
            router.push('/login')
            return Promise.reject(refreshError)
        } finally {
            isRefreshing = false
        }
    },
)

export default api
