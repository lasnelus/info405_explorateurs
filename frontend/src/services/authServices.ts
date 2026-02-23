import api from "@/services/api"

interface LoginResponse {
  accessToken: string
}

export const login = (email: string, password: string) => {
  return api.post<LoginResponse>("/auth/login", { email, password })
}