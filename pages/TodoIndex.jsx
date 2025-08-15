const { useSelector } = ReactRedux

import { todoService } from "../services/todo/todo.index.js"
import { todoActions } from "../stroe/actions/todo.actions.js"
import { userActions } from "../stroe/actions/user.actions.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

import { TodoFilter } from "../cmps/todo/TodoFilter.jsx"
import { TodoList } from "../cmps/todo/TodoList.jsx"
import { DataTable } from "../cmps/todo/data-table/DataTable.jsx"

const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

export function TodoIndex() {

    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const todos = useSelector(storeState => storeState.todoModule.todos)

    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()

    const defaultFilter = todoService.getFilterFromSearchParams(searchParams)

    const [filterBy, setFilterBy] = useState(defaultFilter)

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

    if (!todos) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilterBy={setFilterBy} />
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}