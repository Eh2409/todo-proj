import { todoService } from "../../services/todo/todo.index.js";
import { store } from "../store.js";
import { ADD_TODO, REMOVE_TODO, SET_DONE_PERCENTAGE, SET_TODOS, UPDATE_TODO } from "../reducers/todo.reducer.js";

export const todoActions = {
    loadTodos,
    remove,
    save,
    getDoneTodosPercentage
}

function loadTodos(filterBy = {}) {
    return todoService.query(filterBy)
        .then(todos => {
            store.dispatch({ type: SET_TODOS, todos })
        })
        .catch(err => {
            console.log('todo action -> Cannot load todos', err)
            throw err
        })
}

function remove(todoId) {
    return todoService.remove(todoId)
        .then(() => {
            store.dispatch({ type: REMOVE_TODO, todoId })
            getDoneTodosPercentage()
        })
        .catch(err => {
            console.log('todo action -> Cannot remove todo', err)
            throw err
        })
}

function save(todoToSave) {
    return todoService.save(todoToSave)
        .then(savedTodo => {

            if (todoToSave._id) {
                store.dispatch({ type: UPDATE_TODO, todo: savedTodo })
            } else {
                store.dispatch({ type: ADD_TODO, todo: savedTodo })
            }

            getDoneTodosPercentage()

            return savedTodo._id
        })
        .catch(err => {
            console.log('todo action -> Cannot save todo', err)
            throw err
        })
}

function getDoneTodosPercentage() {
    return todoService.getDoneTodosPercentage()
        .then(doneTodosPercentage => {
            store.dispatch({ type: SET_DONE_PERCENTAGE, doneTodosPercentage })
        })
        .catch(err => {
            console.log('todo action -> Cannot get todo percentage', err)
            throw err
        })
}
