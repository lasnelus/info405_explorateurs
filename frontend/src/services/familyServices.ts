import api from './api'

export const getFamilies = () => {
  return api.get(`/family`)
}

export const getFamily = (familyId: string) => {
  return api.get(`/family/${familyId}`)
}

export const createFamily = (name: string, guardianId: string) => {
  return api.post('/family', {
    name,
    guardianId,
  })
}