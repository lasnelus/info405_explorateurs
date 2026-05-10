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
export const getStaff = () => {
  // TODO -- Pas de route existante At The Moment
}