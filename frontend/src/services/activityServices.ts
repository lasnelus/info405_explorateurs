import api from "@/services/api"

export const getActivities = () => {
  return api.get("/periode")
}

export const getActivity = (id: number) => {
  return api.get(`/periode/${id}`)
}

export const registerChildToActivity = (childId: string, activityId: string, date: string) => {
  return api.post(`/periode/${activityId}/register`, {
    childId,
    date
  })
}
