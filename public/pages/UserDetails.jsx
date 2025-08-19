const { useState, useEffect, useRef } = React
const { useSelector } = ReactRedux
const { useParams, useNavigate, Link, Outlet, NavLink } = ReactRouterDOM


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


    if (!loggedinUser) return
    return (
        <section className="user-details">
            <h2>Hello {loggedinUser.fullname}</h2>

            <nav className="user-details-menu">
                <NavLink to={`/user/${loggedinUser._id}/settings`}>My Settings</NavLink>
                <NavLink to={`/user/${loggedinUser._id}/activities`}>My Activities</NavLink>
            </nav>

            <section className="user-details-content">
                <Outlet />
            </section>

        </section >
    )
}