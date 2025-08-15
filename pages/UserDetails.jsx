const { useState, useEffect, useRef } = React
const { useSelector } = ReactRedux
const { useParams, useNavigate, Link } = ReactRouterDOM

import { UserActivities } from "../cmps/user/UserActivities.jsx"
import { UserSettings } from "../cmps/user/UserSettings.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userActions } from "../stroe/actions/user.actions.js"

export function UserDetails(props) {
    const navigate = useNavigate()
    const params = useParams()
    const { userId } = params

    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

    useEffect(() => {
        if (!loggedinUser || loggedinUser._id !== userId) {
            navigate('/')
        }
    }, [loggedinUser, userId])


    function onSaveUserToUpdate(userToEdit) {
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


    if (!loggedinUser) return
    return (
        <section className="user-details">
            <h2>Hello {loggedinUser.fullname}</h2>

            <aside></aside>

            <section>
                <UserSettings loggedinUser={loggedinUser} onSaveUserToUpdate={onSaveUserToUpdate} />

                <UserActivities loggedinUser={loggedinUser} />


            </section>

        </section >
    )
}