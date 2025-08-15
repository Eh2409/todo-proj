const { useState, useEffect, useRef, Fragemnt } = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector } = ReactRedux


import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './user/LoginSignup.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userActions } from "../stroe/actions/user.actions.js"
import { todoActions } from "../stroe/actions/todo.actions.js"
import { Popup } from "./Popup.jsx"
import { UserMenu } from "./user/UserMenu.jsx"


export function AppHeader() {
    const navigate = useNavigate()
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const doneTodosPercentage = useSelector(storeState => storeState.todoModule.doneTodosPercentage)

    const [currPercentage, setCurrPercentage] = useState(0)
    const percentageRef = useRef()
    const userMenuRef = useRef()
    const userBtnRef = useRef()

    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isSignup, setIsSignUp] = useState(false)

    useEffect(() => {
        onLoadDoneTodosPercentage()
    }, [])

    useEffect(() => {
        if (isUserMenuOpen) {
            addEventListener('mousedown', handleClickOutside)
        } else {
            removeEventListener('mousedown', handleClickOutside)
        }

        return (() => {
            removeEventListener('mousedown', handleClickOutside)
        })
    }, [isUserMenuOpen])

    useEffect(() => {
        if (loggedinUser) {
            if (loggedinUser.prefs.color) document.body.style.color = loggedinUser.prefs.color
            if (loggedinUser.prefs.bgColor) document.body.style.backgroundColor = loggedinUser.prefs.bgColor
        } else {
            document.body.style.color = ''
            document.body.style.backgroundColor = ''
        }
    }, [loggedinUser])

    function handleClickOutside({ target }) {
        const elUserMenu = userMenuRef.current
        const elUserBtn = userBtnRef.current
        if (target !== elUserMenu && !elUserMenu.contains(target)) {
            if (target === elUserBtn || elUserBtn.contains(target)) return
            toggleIsUserMenuOpen()
        }
    }

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
                showSuccessMsg('Logout in successfully')
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

    function toggleIsUserMenuOpen() {
        setIsUserMenuOpen(!isUserMenuOpen)
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
                    < section
                        className="user-btn">

                        <button
                            ref={userBtnRef}
                            onClick={toggleIsUserMenuOpen}>
                            <span>{loggedinUser.fullname}</span>
                        </button>

                        <span>{loggedinUser.balance}</span>

                        <UserMenu
                            loggedinUser={loggedinUser}
                            onLogout={onLogout}
                            userMenuRef={userMenuRef}
                            isUserMenuOpen={isUserMenuOpen}
                            toggleIsUserMenuOpen={toggleIsUserMenuOpen}
                        />
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
