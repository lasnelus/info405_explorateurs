import api from "@/services/api"

export const getActivities = () => {
  return api.get("/periode")
}

export const getActivity = (id: number) => {
  return api.get(`/periode/${id}`)
}

export const postActivity =(title: string, description: string, ageMin: number, ageMax: number, capacity: number, firstDay: string, lastDay: string) => {
  return api.post(`/periode`, {
    title,
    description,
    ageMin,
    ageMax,
    capacity,
    firstDay,
    lastDay
  })
}

export const patchActivity = (id: string, title: string, description: string, ageMin: number, ageMax: number, capacity: number, firstDay: string, lastDay: string) => {
  return api.post(`/periode/${id}`, {
    id,
    title,
    description,
    ageMin,
    ageMax,
    capacity,
    firstDay,
    lastDay
  })
}

export const deleteActifity = (periodeId: string) => {
  return api.delete(`/periode/${periodeId}`)
}

export const getSlotsByActivity = (periodeId: string) => {
  return api.get(`/periode/${periodeId}/slots`)
}

export const getQueueByActivity = (periodeId: string) => {
  return api.get(`/periode/${periodeId}/queues`)
}

export const registerChildToActivity = (childId: string, activityId: string, date: string) => {
  return api.post(`/periode/${activityId}/register`, {
    childId,
    date
  })
}

export const acceptSlot = (periodeId: string, queueId: string) => {
  return api.post(`/periode/${periodeId}/queue/${queueId}/accept`)
}

export const leaveQueue  = (periodeId: string, queueId: string) => {
  return api.delete(`/periode/${periodeId}/queue/${queueId}`)
}

export const leaveActivity = (periodeId: string, slotId: string) => {
  return api.delete(`/periode/${periodeId}/slot/${slotId}`)
}