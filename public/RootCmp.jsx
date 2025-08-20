const Router = ReactRouterDOM.BrowserRouter
const { Routes, Route } = ReactRouterDOM
const { Provider } = ReactRedux
const { useEffect } = React

import { AppHeader } from "./cmps/AppHeader.jsx"
import { Home } from "./pages/Home.jsx"
import { About } from "./pages/About.jsx"
import { TodoIndex } from "./pages/TodoIndex.jsx"
import { TodoDetails } from "./pages/TodoDetails.jsx"
import { AboutTeam } from "./cmps/AboutTeam.jsx"
import { AboutVision } from "./cmps/AboutVision.jsx"
import { Dashboard } from "./pages/Dashboard.jsx"
import { store } from "./stroe/store.js"
import { UserDetails } from "./pages/UserDetails.jsx"
import { UserSettings } from "./cmps/user/UserSettings.jsx"
import { UserActivities } from "./cmps/user/UserActivities.jsx"
import { todoActions } from "./stroe/actions/todo.actions.js"
import { showErrorMsg } from "./services/event-bus.service.js"

export function RootCmp() {

    useEffect(() => {
        todoActions.loadTodos()
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Cannot load todos')
            })
    })


    return (
        <Provider store={store}>
            <Router>
                <section className="app main-layout">
                    <AppHeader />
                    <main className="app-main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />}>
                                <Route path="team" element={<AboutTeam />} />
                                <Route path="vision" element={<AboutVision />} />
                            </Route>
                            <Route path="/todo/:todoId" element={<TodoDetails />} />
                            <Route path="/todo" element={<TodoIndex />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/user/:userId" element={<UserDetails />} >
                                <Route path="settings" element={<UserSettings />} />
                                <Route path="activities" element={<UserActivities />} />
                            </Route>
                        </Routes>
                    </main>
                </section>
            </Router>
        </Provider >
    )
}