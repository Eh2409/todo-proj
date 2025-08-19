import { TodoLoader } from "./TodoLoader.jsx"
import { TodoTableRow } from "./TodoTableRow.jsx"


export function TodoTable({ todos, onRemoveTodo, onToggleTodo, todoIdToEdit, onSetTodoIdToEdit, toggleIsEditorOpen, saveTodo, isLoading }) {

    return (
        <table className="todo-table">
            <thead className={isLoading ? "loading" : ""}>
                <tr>
                    <th className=""></th>
                    <th className="title-th">Title</th>
                    <th>Importance</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {isLoading ?
                    (Array.from({ length: 8 }).map((_, idx) => {
                        console.log('idx:', idx)
                        const isEvenNum = (idx + 1) % 2 === 0
                        return <TodoLoader key={idx} isEvenNum={isEvenNum} />
                    }))
                    : todos.length > 0 ? todos.map(todo =>
                        <TodoTableRow
                            todo={todo}
                            onRemoveTodo={onRemoveTodo}
                            onToggleTodo={onToggleTodo}
                            todoIdToEdit={todoIdToEdit}
                            onSetTodoIdToEdit={onSetTodoIdToEdit}
                            toggleIsEditorOpen={toggleIsEditorOpen}
                            saveTodo={saveTodo}
                            key={todo._id}
                        />
                    )
                        : <tr ><td className="no-todo-found-msg" colSpan="5">No todos found. Time to create one!</td></tr>
                }


            </tbody>
        </table>
    )
}