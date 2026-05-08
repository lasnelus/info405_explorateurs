import api from "@/services/api"

export const addEmergencyContact = (childId: string, firstName: string, lastName: string, phoneNumber:string) => {
    return api.post(`/child/${childId}/emergency-contact`, {
        firstName,
        lastName,
        phoneNumber
    })
}

export const addAllergieChild = (childId: string, allergy: string) => {
    return api.post(`/child/${childId}/allergies`, {
        allergy
    })
}

export const addFamilyChild = (childId: string, FamilyId: string) => {
    return api.post(`/child/${childId}/family/${FamilyId}`)
}

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

/**
 * Renvoie tout les enfants
 */
export const getChildren = () => {
  return api.get(`/child`)
}

/**
 * Renvoie toutes les familles
 */
export const getFamillies = () => {
  // FIXME -- Pas de route existante At The Moment
  return api.get(`/family`)
}

/**
 * Renvoie tout les animateurs
 */
export const getStaff = () => {
  // TODO -- Pas de route existante At The Moment
}
