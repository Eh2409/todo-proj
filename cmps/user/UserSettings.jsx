const { useState } = React

export function UserSettings({ loggedinUser, onSaveUserToUpdate }) {

    const [userToEdit, setUserToEdit] = useState({
        fullname: '', prefs: {
            color: loggedinUser.prefs.color || '',
            bgColor: loggedinUser.prefs.bgColor || ''
        }
    })

    function handleChange({ target }) {
        const { name, value } = target

        if (name === 'fullname') {
            setUserToEdit(prev => ({ ...prev, fullname: value }))
        } else {
            setUserToEdit(prev => ({
                ...prev,
                prefs: { ...prev.prefs, [name]: value }
            }))
        }
    }

    function isDisabled() {
        if (!userToEdit.fullname && !userToEdit.prefs.color && !userToEdit.prefs.bgColor
            || !userToEdit.fullname &&
            userToEdit.prefs.color === loggedinUser.prefs.color &&
            userToEdit.prefs.bgColor === loggedinUser.prefs.bgColor
        ) {
            return true
        } else return false
    }

    function onSubmit(ev) {
        ev.preventDefault()
        onSaveUserToUpdate(userToEdit)
    }

    const { fullname, prefs: { color, bgColor } } = userToEdit

    return (
        <section>
            <form onSubmit={onSubmit}>
                <label htmlFor="fullname">Update Fullname:</label>
                <input type="text" name="fullname" id="fullname" value={fullname} onChange={handleChange} />

                <label htmlFor="color">color:</label>
                <input type="color" name="color" id="color" value={color} onChange={handleChange} />

                <label htmlFor="bgColor">Background Color:</label>
                <input type="color" name="bgColor" id="bgColor" value={bgColor} onChange={handleChange} />

                <button disabled={isDisabled()}>save</button>
            </form>
        </section>
    )
}