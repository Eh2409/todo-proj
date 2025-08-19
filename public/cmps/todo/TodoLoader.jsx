export function TodoLoader({ isEvenNum = false }) {
    return <tr className={`todo-loader ${isEvenNum ? "even" : ""}`}>
        <td colSpan="5"></td>
    </tr>
}