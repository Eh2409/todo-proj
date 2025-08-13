
import { userService as local } from "./user.service.local.js"

const isRemote = false

function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'muki',
        password: 'muki1',
    }
}

const service = local
export const userService = { ...service, getEmptyCredentials }