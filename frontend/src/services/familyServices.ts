import api from './api'

export const getFamily = (familyId: string) => {
  return api.get(`/family/${familyId}`)
}

export const createFamily = (name: string, guardianId: string) => {
  return api.post('/family', {
    name,
    guardianId,
  })
}

export const getChild = (childId: string) => {
  return api.get(`/child/${childId}`)
}

export const acceptChildQueue = (periodeId: string, queueId: string) => {
  return api.post(`/periode/${periodeId}/queue/${queueId}/accept`)
}

export const declineChildQueue = (periodeId: string, queueId: string) => {
  return api.delete(`/periode/${periodeId}/queue/${queueId}`)
}