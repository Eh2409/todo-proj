const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector } = ReactRedux


import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './user/LoginSignup.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'
import { userActions } from "../stroe/actions/user.actions.js"


export function AppHeader() {
    const navigate = useNavigate()
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)


    function onLogout() {
        userActions.logout()
            .then(() => {
                onSetUser(null)
            })
            .catch((err) => {
                showErrorMsg('OOPs try again')
            })
    }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>

                {loggedinUser ? (
                    < section >
                        <Link to={`/user/${loggedinUser._id}`}>Hello {loggedinUser.fullname}</Link>
                        <button onClick={onLogout}>Logout</button>
                    </ section >
                ) : (
                    <section>
                        <LoginSignup />
                    </section>
                )}

                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>

            </section>
            <UserMsg />
        </header>
    )
}
