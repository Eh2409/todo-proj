
const { combineReducers, compose, createStore } = Redux

import { todoReducer } from "./reducers/todo.reducer.js"

const rootReducer = combineReducers({
    todoModule: todoReducer,
})

export const store = createStore(rootReducer)