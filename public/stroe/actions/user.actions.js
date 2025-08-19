import { userService } from "../../services/user/user.index.js";
import { SET_LOGGEDIN_USER, SET_USERS } from "../reducers/user.reducer.js";
import { store } from "../store.js";

export const userActions = {
    loadUser,
    update,
    login,
    signup,
    logout,
    addActivity
}

function loadUser(filterBy = {}) {
    return userService.query(filterBy)
        .then(users => {
            store.dispatch({ type: SET_USERS, users })
        })
        .catch(err => {
            console.log('user action -> Cannot load users', err)
            throw err
        })
}

function update(userToUpdate) {
    return userService.update(userToUpdate)
        .then(user => {
            store.dispatch({ type: SET_LOGGEDIN_USER, loggedinUser: user })
        })
        .catch(err => {
            console.log('user action -> Cannot update user', err)
            throw err
        })
}

function addActivity(activity) {
    const user = userService.getLoggedinUser()
    if (!user) return

    const userToUpdate = { _id: user._id, activity }

    return userService.update(userToUpdate)
        .then(user => {
            store.dispatch({ type: SET_LOGGEDIN_USER, loggedinUser: user })
        })
        .catch(err => {
            console.log('user action -> Cannot add activity to user', err)
            throw err
        })
}

// auth

function login(credentials) {
    return userService.login(credentials)
        .then(user => {
            store.dispatch({ type: SET_LOGGEDIN_USER, loggedinUser: user })
        })
        .catch(err => {
            console.log('user action -> Cannot login', err)
            throw err
        })
}

function signup(credentials) {
    return userService.signup(credentials)
        .then(user => {
            store.dispatch({ type: SET_LOGGEDIN_USER, loggedinUser: user })
        })
        .catch(err => {
            console.log('user action -> Cannot signup', err)
            throw err
        })
}

function logout() {
    return userService.logout()
        .then(() => {
            store.dispatch({ type: SET_LOGGEDIN_USER, loggedinUser: null })
        })
        .catch(err => {
            console.log('user action -> Cannot logout', err)
            throw err
        })
}

