import api from "@/services/api"

export const addEmergencyContact = (childId: string, firstName: string, lastName: string, phoneNumber:string) => {
    return api.post(`/child/${childId}/emergency-contact`, {
        firstName,
        lastName,
        phoneNumber
    })
}