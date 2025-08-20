import { loggerService } from './logger.service.js'
import { makeId, readJsonFile, writeJsonFile } from './util.servics.js'


export const userService = {
    query,
    getById,
    getByUsername,
    add,
    update,
    remove,
}

const users = readJsonFile('data/user.json')


function query(filterBy = {}) {
    return Promise.resolve(users)
        .then(users => {
            var filteredUsers = structuredClone(users)

            filteredUsers.map(user => delete user.password)

            filteredUsers = filteredUsers.sort((u1, u2) => (u1.createdAt - u2.createdAt) * -1)

            return filteredUsers
        })
}

function getById(userId) {
    var user = users.find(user => user._id === userId)
    if (!user) return Promise.reject(`cannot find user ${userId}`)
    user = { ...user }
    delete user.password
    return Promise.resolve(user)
}

function getByUsername(username) {
    const user = users.find(user => user.username === username)
    return Promise.resolve(user)
}

function remove(userId) {
    const idx = users.findIndex(user => user._id === userId)

    if (idx === -1) {
        loggerService.error(`Cannot find user ${userId}`)
        return Promise.reject(`Cannot remove user`)
    }

    users.splice(idx, 1)
    return _saveUsers()
}

function add(credentials) {
    const { username, password, fullname } = credentials

    if (!username || !password || !fullname) {
        return Promise.reject('Missing required credentials')
    }

    return getByUsername(username).then(isUserNameTaken => {
        if (isUserNameTaken) {
            return Promise.reject('Username is taken')
        }

        const userToSave = {
            _id: makeId(),
            username,
            password,
            fullname,
            isAdmin: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            balance: 1000,
            activities: [],
            prefs: { color: '', bgColor: '' }
        }

        users.unshift(userToSave)

        return _saveUsers().then(() => {
            const savedUser = { ...userToSave }
            delete savedUser.password
            return Promise.resolve(savedUser)
        })
    })
}

function update(updatedUser) {
    const { _id, fullname, balance, prefs, activity } = updatedUser

    const idx = users.findIndex(user => user._id === _id)
    if (idx === -1) {
        return Promise.reject(`user ${_id} dont found`)
    }

    const userToUpdate = users[idx]

    if (balance) userToUpdate.balance = balance
    if (fullname) userToUpdate.fullname = fullname
    if (prefs) userToUpdate.prefs = { ...userToUpdate.prefs, ...prefs }
    if (activity) userToUpdate.activities.unshift(activity)

    userToUpdate.updatedAt = Date.now()

    users[idx] = userToUpdate

    return _saveUsers().then(() => {
        const savedUser = { ...users[idx] }
        delete savedUser.password
        return Promise.resolve(savedUser)
    })
}

function _saveUsers() {
    return writeJsonFile('data/user.json', users)
}

