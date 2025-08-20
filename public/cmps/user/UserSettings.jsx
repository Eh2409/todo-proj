const { useState } = React
const { useSelector } = ReactRedux

import { userActions } from "../../stroe/actions/user.actions.js"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service.js"

export function UserSettings() {
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

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


    function onSaveUserToUpdate(ev) {
        ev.preventDefault()
        const userToSave = { _id: loggedinUser._id, ...userToEdit }

        userActions.update(userToSave)
            .then(() => {
                showSuccessMsg('User updated successfully')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot update user ')
            })
    }


    const { fullname, prefs: { color, bgColor } } = userToEdit

    return (
        <section className="user-settings">
            <h3>Settings</h3>

            <form onSubmit={onSaveUserToUpdate}>
                <label htmlFor="fullname">Update Fullname:</label>
                <input type="text" name="fullname" id="fullname" value={fullname} onChange={handleChange} />

                <label htmlFor="color">Color:</label>
                <input type="color" name="color" id="color" className="input-color" value={color || '#000000'} onChange={handleChange} />

                <label htmlFor="bgColor">Background Color:</label>
                <input type="color" name="bgColor" id="bgColor" className="input-color" value={bgColor || '#000000'} onChange={handleChange} />

                <button disabled={isDisabled()} className="save-btn">Save</button>
            </form>
        </section>
    )
}