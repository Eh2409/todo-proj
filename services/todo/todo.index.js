import { utilService } from "../util.service.js"

import { todoService as local } from "./todo.service.local.js"

const isRemote = false

function getEmptyTodo(txt = '', importance = 5) {
    return { txt, description: '', importance, isDone: false, color: undefined }
}

function getDefaultFilter() {
    return {
        txt: '',
        importance: 0,
        isDone: undefined,
        sortType: 'createdAt',
        dir: -1,
    }
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}

    for (const field in defaultFilter) {
        if (field === 'isDone') {
            filterBy[field] = utilService.parseIsDone(searchParams.get(field))
        } else if (field === 'dir') {
            filterBy[field] = +searchParams.get(`dir`) || defaultFilter[field]
        } else {
            filterBy[field] = searchParams.get(field) || ''
        }
    }
    return filterBy
}

const service = local
export const todoService = { ...service, getEmptyTodo, getDefaultFilter, getFilterFromSearchParams }