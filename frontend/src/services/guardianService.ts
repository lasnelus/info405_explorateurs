import api from "./api"

export interface Activity {
  id: string
  title: string
  status: "PENDING" | "CONFIRMED"
}

export interface Registration {
  id: string
  activityTitle: string
  status: "PENDING" | "CONFIRMED"
}

export interface Child {
  id: string
  firstName: string
  lastName: string
  upcomingActivities?: Activity[]
  registrations?: Registration[]
}

export interface Family {
  id: string
  name?: string
  children?: Child[]
}

export interface Guardian {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
  updatedAt: string
  families: Family[]
}


/* =========================
   Guardian API
========================= */

export const getProfile = () => {
  return api.get("/guardian/me")
}