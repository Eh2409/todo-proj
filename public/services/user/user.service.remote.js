const BASE_URL = '/api/user'
const AUTH_URL = '/api/auth'

export const userService = {
    query,
    getById,
    update,
    remove,
    //auth
    signup,
    login,
    logout,
    getLoggedinUser
}

const STORAGE_KEY_LOGGEDIN = 'user'

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
}

function getById(userId) {
    return axios.get(BASE_URL + '/' + userId)
        .then(res => res.data)
}

function remove(userId) {
    return axios.delete(BASE_URL + '/' + userId)
        .then(res => res.data)
}

function update(updatedUser) {
    const userId = updatedUser._id

    return axios.put(BASE_URL + '/' + userId, updatedUser)
        .then(res => _setLoggedinUser(res.data))
}

// auth

function signup(credentials) {
    return axios.post(AUTH_URL + '/signup', credentials)
        .then(res => _setLoggedinUser(res.data))
}
function login(credentials) {
    return axios.post(AUTH_URL + '/login', credentials)
        .then(res => _setLoggedinUser(res.data))
}
function logout() {
    return axios.post(AUTH_URL + '/logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
            return Promise.resolve()
        })
}

function _setLoggedinUser(user) {
    const userToSave = {
        _id: user._id,
        fullname: user.fullname,
        balance: user.balance,
        activities: user.activities,
        prefs: user.prefs
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}


function getLoggedinUser() {
    const json = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
}
