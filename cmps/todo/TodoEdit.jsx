
import { todoService } from "../../services/todo/todo.index.js"

const { useState, useEffect, Fragment } = React

export function TodoEdit({ toggleIsEditorOpen, saveTodo, todoIdToEdit, onSetTodoIdToEdit }) {

    const [todoToEdit, setTodoToEdit] = useState(todoService.getEmptyTodo())

    useEffect(() => {
        if (todoIdToEdit) {
            loadTodo()
        }
    }, [todoIdToEdit])

    function loadTodo() {
        todoService.get(todoIdToEdit)
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
            value = value ? "#e6fffb" : undefined
        }

        setTodoToEdit(prevTodoToEdit => ({ ...prevTodoToEdit, [field]: value }))
    }

    function onSaveTodo(ev) {
        ev.preventDefault()
        saveTodo(todoToEdit)
    }

    const { txt, description, importance, isDone, color } = todoToEdit

    if (todoIdToEdit && !todoToEdit._id) return 'loading...'
    return (
        <section className="todo-edit" colSpan="5" style={{ backgroundColor: color }}>

            <div className="row">
                <h2>{todoIdToEdit ? `Edit Todo` : "Add Todo"}</h2>
                <button onClick={() => todoIdToEdit ? onSetTodoIdToEdit(null) : toggleIsEditorOpen()}>x</button>
            </div>

            <form onSubmit={onSaveTodo} >
                <div className="row">
                    <input
                        onChange={handleChange}
                        value={txt} type="text"
                        name="txt"
                        placeholder="title"
                        className="input-txt" />

                    <input onChange={handleChange}
                        value={importance}
                        type="number"
                        name="importance"
                        title="importance"
                        min={1} max={10} />
                </div>

                <textarea
                    onChange={handleChange}
                    value={description}
                    name="description"
                    id="description"
                    placeholder="Add todo description">
                </textarea>

                <div className="row">

                    <label title={isDone ? "Mark as Undone" : "Mark as done"} className="btn action">
                        <img src={`/assets/img/${isDone ? "done" : "undone"}.svg`} alt="done" className="icon" />
                        <input onChange={handleChange} value={isDone} type="checkbox" name="isDone" hidden={true} />
                    </label>

                    <label title={color ? "Remove background color" : "Add background color"} className="btn action">
                        <img src={`/assets/img/${color ? "no-color" : "color"}.svg`} alt="use color" className="icon" />
                        <input onChange={handleChange} type="checkbox" value={!!color} checked={!!color} name="color" hidden={true} />
                    </label>

                    {color && <Fragment>
                        <input onChange={handleChange} value={color} type="color" name="color" className="input-color" />
                    </Fragment>}

                    <button className="save-btn">Save</button>
                </div>

            </form>
        </section>
    )
}