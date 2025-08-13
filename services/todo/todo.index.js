
import { todoService as local } from "./todo.service.local.js"

const isRemote = false

function getEmptyTodo(txt = '', importance = 5) {
    return { txt, importance, isDone: false }
}

function getDefaultFilter() {
    return { txt: '', importance: 0 }
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        filterBy[field] = searchParams.get(field) || ''
    }
    return filterBy
}

const service = local
export const todoService = { ...service, getEmptyTodo, getDefaultFilter, getFilterFromSearchParams }