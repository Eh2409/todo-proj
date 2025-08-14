const { useState, useEffect, useRef } = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector } = ReactRedux


import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './user/LoginSignup.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userActions } from "../stroe/actions/user.actions.js"
import { todoActions } from "../stroe/actions/todo.actions.js"
import { Popup } from "./Popup.jsx"


export function AppHeader() {
    const navigate = useNavigate()
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const doneTodosPercentage = useSelector(storeState => storeState.todoModule.doneTodosPercentage)

    const [currPercentage, setCurrPercentage] = useState(0)
    const percentageRef = useRef()

    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [isSignup, setIsSignUp] = useState(false)

    useEffect(() => {
        onLoadDoneTodosPercentage()
    }, [])

    useEffect(() => {
        var counter = currPercentage
        const intervalId = setInterval(() => {
            if (counter === doneTodosPercentage) {
                clearInterval(intervalId)
                setCurrPercentage(doneTodosPercentage)
            } else {
                if (counter < doneTodosPercentage) {
                    counter++
                } else {
                    console.log('pepe:')
                    counter -= 1
                }
                percentageRef.current.innerText = counter + '%'
            }
        }, 10)

        return (() => {
            clearInterval(intervalId)
        })
    }, [doneTodosPercentage])


    function onLoadDoneTodosPercentage() {
        todoActions.getDoneTodosPercentage()
            .catch((err) => {
                showErrorMsg('Cannot get todo percentage')
            })
    }


    function login(credentials) {
        userActions.login(credentials)
            .then(() => {
                showSuccessMsg('Logged in successfully')
                toggleIsPopupOpen()
            })
            .catch((err) => {
                console.log(err);
                showErrorMsg('Oops try again')
            })
    }

    function signup(credentials) {
        userActions.signup(credentials)
            .then(() => {
                showSuccessMsg('Signed in successfully')
                toggleIsPopupOpen()
            })
            .catch((err) => { showErrorMsg('Oops try again') })
    }


    function onLogout() {
        userActions.logout()
            .then(() => {
                onSetUser(null)
            })
            .catch((err) => {
                showErrorMsg('OOPs try again')
            })
    }

    function toggleIsSignup() {
        setIsSignUp(!isSignup)
    }

    function toggleIsPopupOpen() {
        setIsPopupOpen(!isPopupOpen)
    }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>


                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>

                {loggedinUser ? (
                    < section >
                        <Link to={`/user/${loggedinUser._id}`}>{loggedinUser.fullname}</Link>
                        <button onClick={onLogout}>Logout</button>
                    </ section >
                ) : (
                    <section>
                        <button onClick={toggleIsPopupOpen}>Login / Signup</button>
                    </section>
                )}


                <Popup
                    header={<h2>{isSignup ? "Signup" : "Login"}</h2>}
                    toggleIsPopupOpen={toggleIsPopupOpen}
                    isPopupOpen={isPopupOpen}>

                    <LoginSignup
                        isPopupOpen={isPopupOpen}
                        signup={signup}
                        login={login}
                        toggleIsSignup={toggleIsSignup}
                        isSignup={isSignup}
                    />

                </Popup>


            </section>
            <UserMsg />

            <div className="full progress-bar">
                <span className="percentage" ref={percentageRef}>{currPercentage}%</span>
                <div className="done-bar" style={{ width: doneTodosPercentage + "%" }}></div>
            </div>

        </header >
    )
}
