import api from "@/services/api"
import { getProfile } from "./guardianService"

interface LoginResponse {
  accessToken: string
}

export const login = (email: string, password: string) => {
  return api.post<LoginResponse>("/auth/login", { email, password })
}

export const signup = (email: string, password: string, firstName: string, lastName: string) => {
  return api.post('/guardian', {
    email,
    password,
    firstName,
    lastName
  })
}

export const role = () => {
  return api.get('/auth/role')
}

export async function loadProfileIfNeeded(auth: any) {
  if (!auth.profile) {
    const roleUser = await role()
    if (roleUser.data.role !== 'GUARDIAN') {
      return null
    }
    const res = await getProfile()
    auth.setProfile(res.data)
    return res.data
  }
  return auth.profile
}
