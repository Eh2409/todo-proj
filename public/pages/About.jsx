

export function About() {

    return (
        <section className="about">

            <div>
                <div className="about-title">Key Features</div>
                <div className="about-subtitle">  Simplifying your workflow, one task at a time.</div>
            </div>

            <section className="features-info">

                <div className="feature-item">
                    <div className="title">Task Management</div>
                    <p>Add new todos, edit existing ones, delete tasks, and mark them as Done—stay on top of everything you need to do.</p>
                </div>

                <div className="feature-item">
                    <div className="title">Organization & Filtering</div>
                    <p>Filter your todos by status, importance, or date to quickly find what matters most and keep your list organized.</p>
                </div>

                <div className="feature-item">
                    <div className="title">Personalization & Styling</div>
                    <p>Color-code your todos to highlight priorities and create a visual system that works for you.</p>
                </div>

                <div className="feature-item">
                    <div className="title">Smooth Interaction</div>
                    <p>Enjoy a simple CRUDL interface—all your tasks are easy to manage, edit, and track with a responsive, user-friendly design.</p>
                </div>

            </section>

        </section>
    )
}

