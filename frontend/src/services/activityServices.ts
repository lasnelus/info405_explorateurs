import api from "@/services/api"

export interface Activity {
  id: number
  title: string
  date: string   // type: "2025-02-01T10:00:00"
  group: number
}

export const getActivities = () => {
  return api.get<Activity[]>("/activities")
}
