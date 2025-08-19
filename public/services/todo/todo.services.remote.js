
const BASE_URL = '/api/todo'

export const todoService = {
    query,
    getById,
    remove,
    save,
    getImportanceStats,
}


function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
}

function getById(todoId) {
    return axios.get(BASE_URL + '/' + todoId)
        .then(res => res.data)
}

function remove(todoId) {
    return axios.delete(BASE_URL + '/' + todoId)
        .then(res => res.data)
}

function save(todo) {
    const method = todo._id ? 'put' : 'post'
    const todoId = todo._id || ''

    return axios[method](BASE_URL + '/' + todoId, todo)
        .then(res => res.data)
}

function getImportanceStats() {
    return axios.get(BASE_URL + '/stats')
        .then(res => res.data)
}