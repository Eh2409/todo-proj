import { TodoTableRow } from "./TodoTableRow.jsx"


export function TodoTable({ todos, onRemoveTodo, onToggleTodo }) {



    return (
        <table className="todo-table">
            <thead>
                <tr>
                    <th className=""></th>
                    <th>Text</th>
                    <th>Importance</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {todos.map(todo =>
                    <TodoTableRow
                        todo={todo}
                        onRemoveTodo={onRemoveTodo}
                        onToggleTodo={onToggleTodo}
                        key={todo._id}
                    />
                )}
            </tbody>
        </table>
    )
}