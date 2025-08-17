const { useSelector } = ReactRedux

import { todoService } from "../services/todo/todo.index.js"
import { todoActions } from "../stroe/actions/todo.actions.js"
import { userActions } from "../stroe/actions/user.actions.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

import { TodoFilter } from "../cmps/todo/TodoFilter.jsx"
import { TodoTable } from "../cmps/todo/TodoTable.jsx"
import { TodoEdit } from "../cmps/todo/TodoEdit.jsx"
import { TodoSort } from "../cmps/todo/TodoSort.jsx"

const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

export function TodoIndex() {

    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const todos = useSelector(storeState => storeState.todoModule.todos)

    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()

    const defaultFilter = todoService.getFilterFromSearchParams(searchParams)

    const [filterBy, setFilterBy] = useState(defaultFilter)
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [todoIdToEdit, setTodoIdToEdit] = useState(null)

    useEffect(() => {
        setSearchParams(filterBy)
        loadTodos(filterBy)
    }, [filterBy])


    function loadTodos(filterBy) {
        todoActions.loadTodos(filterBy)
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Cannot load todos')
            })
    }

    function onRemoveTodo(todoId, todoTitle) {
        const confirmMsg = `Are you sure you want to delete the todo "${todoTitle}"? \n This action cannot be undone.`
        if (!confirm(confirmMsg)) return

        todoActions.remove(todoId)
            .then(() => {
                showSuccessMsg(`Todo removed`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot remove todo ' + todoId)
            })
    }

    function onToggleTodo(todo) {

        const todoToSave = { ...todo, isDone: !todo.isDone }

        todoActions.save(todoToSave)
            .then(() => {
                showSuccessMsg(`Todo is ${(todoToSave.isDone) ? 'done' : 'back on your list'}`)
                if (loggedinUser && todoToSave.isDone) updateBalance()
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todo._id)
            })
    }

    function updateBalance() {
        const userToUpdate = { _id: loggedinUser._id, balance: loggedinUser.balance + 10 }
        userActions.update(userToUpdate)
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot update user ')
            })
    }

    function toggleIsEditorOpen() {
        setIsEditorOpen(!isEditorOpen)
    }

    function saveTodo(todoToEdit) {
        todoActions.save(todoToEdit)
            .then(savedTodoId => {
                showSuccessMsg(`Todo Saved (id: ${savedTodoId})`)

                if (isEditorOpen) toggleIsEditorOpen()
                if (todoIdToEdit) onSetTodoIdToEdit(null)
            })
            .catch(err => {
                showErrorMsg('Cannot save todo')
                console.log('err:', err)
            })
    }

    function onSetTodoIdToEdit(todoId) {
        setTodoIdToEdit(todoId)
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prev => ({ ...prev, ...filterBy }))
    }

    const { txt, importance, isDone, sortType, dir } = filterBy

    if (!todos) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={{ txt, importance, isDone }} onSetFilterBy={onSetFilterBy} />
            <TodoSort sortBy={{ sortType, dir }} onSetFilterBy={onSetFilterBy} />

            <h2>Todos List</h2>

            <div className={`todo-editor-wrapper ${isEditorOpen ? "edit-mode" : ""}`}>
                {isEditorOpen
                    ? <TodoEdit
                        toggleIsEditorOpen={toggleIsEditorOpen}
                        saveTodo={saveTodo}
                    />
                    : <button onClick={toggleIsEditorOpen}>Add Todo</button>
                }
            </div>

            <TodoTable
                todos={todos}
                onRemoveTodo={onRemoveTodo}
                onToggleTodo={onToggleTodo}
                todoIdToEdit={todoIdToEdit}
                onSetTodoIdToEdit={onSetTodoIdToEdit}
                toggleIsEditorOpen={toggleIsEditorOpen}
                saveTodo={saveTodo}
            />


        </section>
    )
}