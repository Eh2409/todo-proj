import { userService } from '../../services/user/user.index.js'

const { useState, useEffect } = React

export function LoginSignup({ isPopupOpen, signup, login, toggleIsSignup, isSignup }) {

    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

    useEffect(() => {
        if (!isPopupOpen) {

            if (isSignup) {
                setTimeout(() => {
                    toggleIsSignup()
                }, 200)
            }

            setCredentials(userService.getEmptyCredentials())
        }
    }, [isPopupOpen])


    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        onLogin(credentials)
    }

    function onLogin(credentials) {
        isSignup ? signup(credentials) : login(credentials)
    }
    return (
        <div className="login-signup">
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                    autoFocus
                />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    autoComplete="off"
                />
                {isSignup && <input
                    type="text"
                    name="fullname"
                    value={credentials.fullname}
                    placeholder="Full name"
                    onChange={handleChange}
                    required
                />}
                <button className={isSignup ? 'signup' : 'login'}>{isSignup ? 'Signup' : 'Login'}</button>
            </form>

            <div className='signup-msg-toggle' >
                <div onClick={toggleIsSignup}>
                    {isSignup ?
                        'Already a member? Login' :
                        'New user? Signup here'
                    }
                </div >
            </div>
        </div >
    )
}
