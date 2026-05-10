import api from './api'

export const getChildren = () => {
  return api.get(`/child`)
}

export const getChild = (childId: string) => {
  return api.get(`/child/${childId}`)
}

export const addNewChild = (
  firstName: string,
  lastName: string,
  birthDate: string | Date,
  foodConstraint?: string,
  familyIds?: Array<string>,
) => {
  return api.post(`/child`, {
    firstName,
    lastName,
    birthDate,
    foodConstraint,
    familyIds
  })
}

export const deleteChild = (childId: string) => {
  return api.delete(`/child/${childId}`)
}

export const addEmergencyContact = (
  childId: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
) => {
  return api.post(`/child/${childId}/emergency-contact`, {
    firstName,
    lastName,
    phoneNumber,
  })
}

export const addAllergieChild = (childId: string, allergy: string) => {
  return api.post(`/child/${childId}/allergies`, {
    allergy,
  })
}

export const addFamilyChild = (childId: string, FamilyId: string) => {
  return api.post(`/child/${childId}/family/${FamilyId}`)
}