
import { userService as local } from "./user.service.local.js"
import { userService as remote } from "./user.service.remote.js"

const isRemote = true

function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'muki',
        password: 'muki1',
    }
}

const service = isRemote ? remote : local
export const userService = { ...service, getEmptyCredentials }