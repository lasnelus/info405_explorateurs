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

        // don't try to refresh or redirect when the failed request is
        // itself a login/refresh call – the login component wants to
        // handle its own errors.
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

            try {
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                )

                const newAccessToken = refreshResponse.data.accessToken
                auth.setAccessToken(newAccessToken)

                if (!originalRequest.headers) {
                    originalRequest.headers = {}
                }
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return api(originalRequest)
            } catch {
                auth.clearAccessToken()
                window.location.href = "/"
            }
        }

        return Promise.reject(error)
    }
)

export default api
