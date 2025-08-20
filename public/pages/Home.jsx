const { NavLink } = ReactRouterDOM

export function Home() {

    return (
        <section className="full home">
            <div className="home-content">
                <div className="home-title">
                    Your life, <span>organized.</span>
                </div>
                <p className="">
                    Todo app is a simple yet powerful to-do app designed to help you focus, get things done, and feel in control of your day.
                </p>

                <NavLink to="/todo" className='btn get-start'>
                    Get Started
                </NavLink>

            </div>
        </section>
    )

}