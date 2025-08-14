import { todoService } from "../services/todo/todo.index.js"
import { todoActions } from "../stroe/actions/todo.actions.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

const { useState, useEffect, Fragment } = React
const { useNavigate, useParams } = ReactRouterDOM

export function TodoEdit() {

    const [todoToEdit, setTodoToEdit] = useState(todoService.getEmptyTodo())
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.todoId) loadTodo()
    }, [])

    function loadTodo() {
        todoService.get(params.todoId)
            .then(setTodoToEdit)
            .catch(err => console.log('err:', err))
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        if (field === 'color' && target.type === 'checkbox') {
            value = value ? "#000000" : undefined
        }

        setTodoToEdit(prevTodoToEdit => ({ ...prevTodoToEdit, [field]: value }))
    }

    function onSaveTodo(ev) {
        ev.preventDefault()
        todoActions.save(todoToEdit)
            .then(savedTodoId => {
                navigate('/todo')
                showSuccessMsg(`Todo Saved (id: ${savedTodoId})`)
            })
            .catch(err => {
                showErrorMsg('Cannot save todo')
                console.log('err:', err)
            })
    }

    const { txt, importance, isDone, color } = todoToEdit

    return (
        <section className="todo-edit">
            <form onSubmit={onSaveTodo} >
                <label htmlFor="txt">Text:</label>
                <input onChange={handleChange} value={txt} type="text" name="txt" id="txt" />

                <label htmlFor="importance">Importance:</label>
                <input onChange={handleChange} value={importance} type="number" name="importance" id="importance" />

                <label htmlFor="isDone">isDone:</label>
                <input onChange={handleChange} value={isDone} type="checkbox" name="isDone" id="isDone" />

                <label htmlFor="color">use color:</label>
                <input onChange={handleChange} type="checkbox" value={!!color} checked={!!color} name="color" id="color" />

                {color && <Fragment>
                    <label htmlFor="color">color:</label>
                    <input onChange={handleChange} value={color} type="color" name="color" id="color" />
                </Fragment>}

                <button>Save</button>
            </form>
        </section>
    )
}