const { useState, useEffect, useRef } = React
const { NavLink } = ReactRouterDOM
const { useSelector } = ReactRedux

// services
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userActions } from "../stroe/actions/user.actions.js"

// cmps
import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './user/LoginSignup.jsx'
import { Popup } from "./Popup.jsx"
import { UserMenu } from "./user/UserMenu.jsx"



export function AppHeader() {
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const doneTodosPercentage = useSelector(storeState => storeState.todoModule.doneTodosPercentage)

    const [currPercentage, setCurrPercentage] = useState(0)
    const percentageRef = useRef()
    const userMenuRef = useRef()
    const userBtnRef = useRef()

    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isSignup, setIsSignUp] = useState(false)
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)


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

    function toggleIsMobileNavOpen() {
        if (window.innerWidth <= 750) {
            setIsMobileNavOpen(!isMobileNavOpen)
        }
    }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">

                <div className='main-logo-wrapper'>
                    <button
                        className='mobile-nav-switch-btn action'
                        onClick={toggleIsMobileNavOpen}>
                        <img src="/assets/img/bars.svg" alt="bars" className='icon' />
                    </button>

                    <h1 className='main-logo'>Todo App</h1>
                </div>

                <div>
                    <div
                        className={`main-nav-black-wrapper ${isMobileNavOpen ? "nav-open" : ""}`}
                        onClick={toggleIsMobileNavOpen}
                    ></div>

                    <nav className={`app-nav ${isMobileNavOpen ? "nav-open" : ""}`}>
                        <div className='nav-header'>
                            <h2>Todo App</h2>

                            <button
                                onClick={toggleIsMobileNavOpen}
                                className='action close-btn'
                            >X</button>
                        </div>
                        <NavLink to="/" onClick={toggleIsMobileNavOpen} >
                            <img src="/assets/img/house.svg" alt="Home" className='icon' />
                            <span>Home</span>
                        </NavLink>
                        <NavLink to="/about" onClick={toggleIsMobileNavOpen} >
                            <img src="/assets/img/address.svg" alt="About" className='icon' />
                            <span>About</span>
                        </NavLink>
                        <NavLink to="/todo" onClick={toggleIsMobileNavOpen}>
                            <img src="/assets/img/list.svg" alt="Todos" className='icon' />
                            <span>Todos</span>
                        </NavLink>
                        <NavLink to="/dashboard" onClick={toggleIsMobileNavOpen} >
                            <img src="/assets/img/chart.svg" alt="Dashboard" className='icon' />
                            <span>Dashboard</span>
                        </NavLink>
                    </nav>
                </div>

                {loggedinUser ? (
                    < section
                        className="user-btn">

                        <button
                            ref={userBtnRef}
                            onClick={toggleIsUserMenuOpen}
                            className='login-signup-btn'>
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
                        <button onClick={toggleIsPopupOpen}
                            className='login-signup-btn'
                        >Login / Signup</button>
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
