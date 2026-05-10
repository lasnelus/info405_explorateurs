import api from "@/services/api"

export const getActivities = () => {
  return api.get("/periode")
}

export const getActivity = (id: string) => {
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
  return api.patch(`/periode/${id}`, {
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

export const deleteActivity = (periodeId: string) => {
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

export const setAttendance = (periodeId: string, slotId: string, isChildPresent: boolean) => {
  return api.put(`/periode/${periodeId}/slot/${slotId}/attendance`, {
    isChildPresent
  })
}
