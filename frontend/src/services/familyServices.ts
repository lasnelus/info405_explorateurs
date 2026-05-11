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

export const patchFamily = (familyId: string, familyName: string) => {
  return api.patch(`/family/${familyId}`, {
    id: familyId,
    name: familyName
  })
}

export const addChildToFamily = (familyId: string, childId: string) => {
  return api.post(`/family/${familyId}/childs/${childId}`)
}

export const removeChildFromFamily = (familyId: string, childId: string) => {
  return api.delete(`/family/${familyId}/childs/${childId}`)
}

export const addGuardianToFamily = (familyId: string, guardianId: string) => {
  return api.post(`/family/${familyId}/guardians/${guardianId}`)
}

export const removeGuardianFromFamily = (familyId: string, guardianId: string) => {
  return api.delete(`/family/${familyId}/guardians/${guardianId}`)
}

export const removeFamily = (familyId: string) => {
  return api.delete(`/family/${familyId}`)
}
