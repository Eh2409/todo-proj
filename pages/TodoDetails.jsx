import { todoService } from "../services/todo/todo.index.js"
import { showErrorMsg } from "../services/event-bus.service.js"
import { utilService } from "../services/util.service.js"


const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

export function TodoDetails() {

    const [todo, setTodo] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadTodo()
    }, [params.todoId])


    function loadTodo() {
        todoService.get(params.todoId)
            .then(setTodo)
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Cannot load todo')
                navigate('/todo')
            })
    }

    function onBack() {
        // If nothing to do here, better use a Link
        navigate('/todo')
        // navigate(-1)
    }

    if (!todo) return <div>Loading...</div>
    return (
        <section className="todo-details" >

            <div className="details-content" style={{ backgroundColor: todo.color }}>
                <h1 className={(todo.isDone) ? 'done' : ''}>{todo.txt}</h1>
                <h2>{(todo.isDone) ? <span className="done-state">👍Done!</span> : 'In your list'}</h2>

                <h3>Todo importance:
                    <span
                        className="num"
                        style={{ backgroundColor: utilService.setImportanceColor(todo.importance) }}>
                        {todo.importance}
                    </span>
                </h3>
                <p>{todo.description}</p>
            </div>

            <div className="details-nav">
                <Link to={`/todo/${todo.prevTodoId}`} className="btn">Previous Todo</Link>
                <button onClick={onBack}>Back to list</button>
                <Link to={`/todo/${todo.nextTodoId}`} className="btn">Next Todo</Link>
            </div>
        </section>
    )
}