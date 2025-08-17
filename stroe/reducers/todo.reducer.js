
export const SET_TODOS = 'SET_TODOS'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'

export const SET_MAX_PAGE_COUNT = 'SET_MAX_PAGE_COUNT'

export const SET_DONE_PERCENTAGE = 'SET_DONE_PERCENTAGE'

const initialState = {
    todos: [],
    doneTodosPercentage: 0,
    maxPageCount: 0
}

export function todoReducer(state = initialState, cmd) {

    switch (cmd.type) {
        case SET_TODOS:
            return { ...state, todos: cmd.todos }

        case ADD_TODO:
            return { ...state, todos: [cmd.todo, ...state.todos] }

        case UPDATE_TODO:
            return {
                ...state,
                todos: state.todos.map(t => t._id === cmd.todo._id ? cmd.todo : t)
            }

        case REMOVE_TODO:
            return {
                ...state,
                todos: state.todos.filter(t => t._id !== cmd.todoId)
            }

        case SET_DONE_PERCENTAGE:
            return { ...state, doneTodosPercentage: cmd.doneTodosPercentage }

        case SET_MAX_PAGE_COUNT:
            return { ...state, maxPageCount: cmd.maxPageCount }

        default: return state
    }
}