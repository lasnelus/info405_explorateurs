import api from '@/services/api'

export const getManager = () => {
  return api.get(`/manager`)
}

export const createManager = (email: string, password:string, firstName: string, lastName: string, role: string) => {
  return api.post(`/manager`, {
    email,
    password,
    firstName,
    lastName,
    role
  })
}

export const getManagerbyId = (managerId: string) => {
  return api.get(`/manager/${managerId}`)
}

export const deleteManager = (managerId: string) => {
  return api.delete(`/manager/${managerId}`)
}
