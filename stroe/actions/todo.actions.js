import { todoService } from "../../services/todo/todo.index.js";
import { store } from "../store.js";
import { ADD_TODO, REMOVE_TODO, SET_DONE_PERCENTAGE, SET_TODOS, UPDATE_TODO } from "../reducers/todo.reducer.js";
import { userActions } from "./user.actions.js";

export const todoActions = {
    loadTodos,
    remove,
    save
}


function loadTodos(filterBy = {}) {
    return todoService.query(filterBy)
        .then(({ todos, doneTodosPercentage }) => {
            store.dispatch({ type: SET_TODOS, todos })
            store.dispatch({ type: SET_DONE_PERCENTAGE, doneTodosPercentage })
        })
        .catch(err => {
            console.log('todo action -> Cannot load todos', err)
            throw err
        })
}

function remove(todoId) {
    return todoService.remove(todoId)
        .then(({ doneTodosPercentage }) => {
            store.dispatch({ type: REMOVE_TODO, todoId })
            store.dispatch({ type: SET_DONE_PERCENTAGE, doneTodosPercentage })

            const activity = { txt: `Removed todo ${todoId}`, at: Date.now() }
            userActions.addActivity(activity)
        })
        .catch(err => {
            console.log('todo action -> Cannot remove todo', err)
            throw err
        })
}

function save(todoToSave) {
    const method = todoToSave._id ? "update" : "add"

    return todoService.save(todoToSave)
        .then(({ todo, doneTodosPercentage }) => {

            if (method === 'update') {
                store.dispatch({ type: UPDATE_TODO, todo })
            } else {
                store.dispatch({ type: ADD_TODO, todo })
            }

            store.dispatch({ type: SET_DONE_PERCENTAGE, doneTodosPercentage })

            const activity = { txt: `${method === 'update' ? "Updated" : "Added"} todo ${todoToSave.txt}`, at: Date.now() }
            userActions.addActivity(activity)

            return todo._id
        })
        .catch(err => {
            console.log('todo action -> Cannot save todo', err)
            throw err
        })
}

