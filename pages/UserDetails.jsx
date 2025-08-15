const { useState, useEffect, useRef } = React
const { useSelector } = ReactRedux
const { useParams, useNavigate, Link } = ReactRouterDOM

import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userActions } from "../stroe/actions/user.actions.js"

export function UserDetails(props) {
    const navigate = useNavigate()
    const params = useParams()
    const { userId } = params

    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const [userToEdit, setUserToEdit] = useState({
        fullname: '', prefs: {
            color: loggedinUser.prefs.color || '',
            bgColor: loggedinUser.prefs.bgColor || ''
        }
    })


    useEffect(() => {
        if (!loggedinUser || loggedinUser._id !== userId) {
            navigate('/')
        }
    }, [loggedinUser, userId])

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


    if (!loggedinUser) return
    return (
        <section className="user-details">
            <h2>Hello {loggedinUser.fullname}</h2>

            <aside></aside>

            <section>
                <form onSubmit={onSaveUserToUpdate}>
                    <label htmlFor="fullname">Update Fullname:</label>
                    <input type="text" name="fullname" id="fullname" value={fullname} onChange={handleChange} />

                    <label htmlFor="color">color:</label>
                    <input type="color" name="color" id="color" value={color} onChange={handleChange} />

                    <label htmlFor="bgColor">Background Color:</label>
                    <input type="color" name="bgColor" id="bgColor" value={bgColor} onChange={handleChange} />

                    <button disabled={isDisabled()}>save</button>
                </form>
            </section>

        </section>
    )
}