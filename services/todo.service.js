import { makeId, readJsonFile, writeJsonFile } from "./util.servics.js"

const PAGE_SIZE = 8

export const todoService = {
    query,
    getById,
    remove,
    add,
    update,
    getImportanceStats,
}

const todos = readJsonFile('data/todo.json')


function query(filterBy = {}) {
    return Promise.resolve(todos).then(todos => {
        var filteredTodos = structuredClone(todos)

        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            filteredTodos = filteredTodos.filter(todo => regExp.test(todo.txt))
        }

        if (filterBy.importance) {
            filteredTodos = filteredTodos.filter(todo => todo.importance >= filterBy.importance)
        }

        if (filterBy.isDone !== undefined) {
            filteredTodos = filteredTodos.filter(todo => todo.isDone === filterBy.isDone)
        }

        if (filterBy.sortType && filterBy.dir) {
            if (filterBy.sortType === 'importance') {
                filteredTodos = filteredTodos.sort((t1, t2) => (t1.importance - t2.importance) * filterBy.dir)
            } else if (filterBy.sortType === 'createdAt') {
                filteredTodos = filteredTodos.sort((t1, t2) => (t1.createdAt - t2.createdAt) * filterBy.dir)
            } else if (filterBy.sortType === 'title') {
                filteredTodos = filteredTodos.sort((t1, t2) => (t1.txt.localeCompare(t2.txt)) * filterBy.dir)
            }
        }

        const filteredTodossLength = filteredTodos.length

        if (filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            filteredTodos = filteredTodos.slice(startIdx, startIdx + PAGE_SIZE)
        }

        return includeDataFromServer({ todos: filteredTodos, filteredTodossLength })
    })

}

function getById(todoId) {
    const todo = todos.find(t => t._id === todoId)
    if (!todo) return Promise.reject(`cannot find todo ${todoId}`)
    return _setNextPrevTodoId(todo)
}

function remove(todoId) {
    const idx = todos.findIndex(t => t._id === todoId)
    if (idx === -1) return Promise.reject(`cannot find todo ${todoId}`)
    todos.splice(idx, 1)
    return _saveTodos().then(() => includeDataFromServer({}))
}

function add(todoToSave) {

    todoToSave.createdAt = Date.now()
    todoToSave.updatedAt = Date.now()
    todoToSave._id = makeId()

    todos.unshift(todoToSave)

    return _saveTodos().then(() => includeDataFromServer({ todo: todoToSave }))
}

function update(todoToSave) {

    const idx = todos.findIndex(t => t._id === todoToSave._id)
    if (idx === -1) return Promise.reject(`cannot find todo ${todoId}`)

    todos[idx] = { ...todos[idx], ...todoToSave, updatedAt: Date.now() }

    const savedTodo = todos[idx]

    return _saveTodos().then(() => includeDataFromServer({ todo: savedTodo }))
}

function includeDataFromServer(data = {}) {
    const filteredTodossLength = data.filteredTodossLength
    return Promise.all([getDoneTodosPercentage(), getMaxPage(filteredTodossLength)])
        .then(([doneTodosPercentage, maxPageCount]) => {
            return { doneTodosPercentage, maxPageCount, ...data }
        })
}

function getMaxPage(filteredTodossLength) {
    if (filteredTodossLength || filteredTodossLength === 0) return Promise.resolve(Math.ceil(filteredTodossLength / PAGE_SIZE))
    return Promise.resolve(todos)
        .then(todos => Math.ceil(todos.length / PAGE_SIZE))
        .catch(err => { throw err })
}


function getDoneTodosPercentage() {
    return Promise.resolve(todos)
        .then(todos => {
            var todosCopy = structuredClone(todos)
            const doneTodosNum = todosCopy.filter(t => t.isDone === true).length
            const doneTodosPercentage = Math.ceil((doneTodosNum / todosCopy.length) * 100)
            return doneTodosPercentage
        })
        .catch(err => { throw err })
}

function getImportanceStats() {
    return Promise.resolve(todos)
        .then(todos => {
            const todoCountByImportanceMap = _getTodoCountByImportanceMap(todos)
            const data = Object.keys(todoCountByImportanceMap).map(speedName => ({ title: speedName, value: todoCountByImportanceMap[speedName] }))
            return data
        })

}

function _setNextPrevTodoId(todo) {
    return Promise.resolve(todos).then((todos) => {
        const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id)
        const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
        const prevTodo = todos[todoIdx - 1] ? todos[todoIdx - 1] : todos[todos.length - 1]
        todo.nextTodoId = nextTodo._id
        todo.prevTodoId = prevTodo._id
        return todo
    })
}

function _getTodoCountByImportanceMap(todos) {
    const todoCountByImportanceMap = todos.reduce((map, todo) => {
        if (todo.importance < 3) map.low++
        else if (todo.importance < 7) map.normal++
        else map.urgent++
        return map
    }, { low: 0, normal: 0, urgent: 0 })
    return todoCountByImportanceMap
}


function _saveTodos() {
    return writeJsonFile('data/todo.json', todos)
}