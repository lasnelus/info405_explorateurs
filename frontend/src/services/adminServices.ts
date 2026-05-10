import api from '@/services/api'

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
export const getManager = () => {
  api.get(`/manager`)
}

export const createManager = (email: string, password:string, firstName: string, lastName: string, role: string) => {
  api.post(`/manager`, {
    email,
    password,
    firstName,
    lastName,
    role
  })
}

export const getManagerbyId = (managerId: string) => {
  api.get(`/manager/${managerId}`)
}

export const deleteManager = (managerId: string) => {
  api.delete(`/manager/${managerId}`)
}