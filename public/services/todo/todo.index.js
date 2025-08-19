import { utilService } from "../util.service.js"

import { todoService as local } from "./todo.service.local.js"
import { todoService as remote } from "./todo.services.remote.js"


const isRemote = true

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
        pageIdx: 0
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
        } else if (field === 'pageIdx') {
            filterBy[field] = +searchParams.get(`pageIdx`) || defaultFilter[field]
        } else {
            filterBy[field] = searchParams.get(field) || defaultFilter[field]
        }
    }
    return filterBy
}

const service = isRemote ? remote : local
export const todoService = { ...service, getEmptyTodo, getDefaultFilter, getFilterFromSearchParams }