
const { useState, Fragment } = React
const { Link } = ReactRouterDOM

export function TodoTableRow({ todo, onRemoveTodo, onToggleTodo }) {

    const [isExpanded, setIsExpanded] = useState(false)

    function setImportanceColor(importanceNum) {
        var color = "green"
        if (importanceNum > 8) {
            return color = "red"
        } else if (importanceNum > 6) {
            return color = "orange"
        } else if (importanceNum > 4) {
            return color = "gold"
        } else if (importanceNum > 2) {
            return color = "yellowgreen"
        }
        return color
    }

    return (
        <Fragment >
            <tr className="todo-prev" style={{ backgroundColor: todo.color }}>
                <td className="spiral"></td>
                <td className={`todo-txt ${todo.isDone ? 'done' : ''}`} onClick={() => { setIsExpanded(!isExpanded) }}>
                    <div className="txt-content">{todo.txt}</div>
                </td>
                <td className="todo-importance">
                    <div className="num" style={{ backgroundColor: setImportanceColor(todo.importance) }}>{todo.importance}</div>
                </td>
                <td className="actions">
                    <button onClick={() => onToggleTodo(todo)} title={todo.isDone ? "Mark as Undone" : "Mark as done"}>
                        <img src={`/assets/img/${todo.isDone ? "done" : "undone"}.svg`} alt="done" className="icon" />
                    </button>
                    <Link to={`/todo/${todo._id}`} className="btn" title="Details">
                        <img src="/assets/img/read.svg" alt="read" className="icon" />
                    </Link>
                    <Link to={`/todo/edit/${todo._id}`} className="btn" title="Edit">
                        <img src="/assets/img/pen.svg" alt="pen" className="icon" />
                    </Link>
                    <button onClick={() => onRemoveTodo(todo._id, todo.txt)} title="Remove">
                        <img src="/assets/img/trash.svg" alt="trash" className="icon" />
                    </button>
                </td>
            </tr>
            <tr hidden={!isExpanded}>
                <td colSpan="5" className="todo-info" style={{ backgroundColor: todo.color }}>
                    <h3>{todo.txt}</h3>
                    <p>{todo.description}</p>
                </td>
            </tr>
        </Fragment>
    )
}