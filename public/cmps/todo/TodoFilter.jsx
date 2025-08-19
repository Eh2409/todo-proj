
const { useState, useEffect, useRef } = React

export function TodoFilter({ filterBy, onSetFilterBy, isFilterOpen, filterRef }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const resetFilterRef = useRef({ txt: '', importance: 0, isDone: undefined })

    useEffect(() => {
        // Notify parent
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

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

            default: break
        }

        if (target.type === 'select-one') {
            switch (value) {
                case 'undefined':
                    value = undefined
                    break;
                case 'false':
                    value = false
                    break;
                case 'true':
                    value = true
                    break;

                default: break;
            }
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    // Optional support for LAZY Filtering with a button
    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    function onReset() {
        setFilterByToEdit(resetFilterRef.current)
    }

    const { txt, importance, isDone } = filterByToEdit
    return (
        <section className={`todo-filter ${isFilterOpen ? "filter-open" : ""}`} ref={filterRef}>
            <div>
                <h2>Filter Todos</h2>
                <form onSubmit={onSubmitFilter}>
                    <input value={txt} onChange={handleChange}
                        type="search" placeholder="By Txt" id="txt" name="txt"
                    />

                    <input value={importance || ''} onChange={handleChange}
                        type="number" placeholder="By Importance" id="importance" name="importance"
                    />

                    <select name="isDone" id="isDone" value={isDone === undefined ? "undefined" : isDone} onChange={handleChange}>
                        <option value="undefined">All</option>
                        <option value="false">Active</option>
                        <option value="true">Done</option>
                    </select>

                    <button type="button" className="reset-btn" onClick={onReset}>Reset</button>
                </form>
            </div>
        </section>
    )
}