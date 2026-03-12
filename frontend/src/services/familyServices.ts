import api from "./api"

export const createFamily = (name: string, guardianId: string) => {
    return api.post('/family', {
        name,
        guardianId
    })
}
