import { userService } from "../../services/user/user.index.js"

export const SET_LOGGEDIN_USER = 'SET_LOGGEDIN_USER'
export const SET_USERS = 'SET_USERS'

const initialState = {
    loggedinUser: userService.getLoggedinUser(),
    users: []
}

export function userReducer(state = initialState, cmd) {
    switch (cmd.type) {
        case SET_LOGGEDIN_USER:
            return { ...state, loggedinUser: cmd.loggedinUser }
        case SET_USERS:
            return { ...state, users: cmd.users }

        default: return state
    }
}