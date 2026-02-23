import api from "@/services/api"

export const getProfile = () => {
  return api.get("/auth/me")
}