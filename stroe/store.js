
const { combineReducers, compose, createStore } = Redux

import { todoReducer } from "./reducers/todo.reducer.js"
import { userReducer } from "./reducers/user.reducer.js"

const rootReducer = combineReducers({
    todoModule: todoReducer,
    userModule: userReducer,
})

export const store = createStore(rootReducer)