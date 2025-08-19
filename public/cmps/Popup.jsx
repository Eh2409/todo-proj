export function Popup({ header, footer, toggleIsPopupOpen, children, isPopupOpen, aside }) {
    return (
        <div className={`popup-black-wrapper ${isPopupOpen ? "open" : ""}`} onClick={toggleIsPopupOpen}>
            <section className="popup" onClick={(event) => event.stopPropagation()}>

                {aside && <aside>
                    {aside}
                </aside>}

                <div className="popup-main-content">
                    <header className="popup-header">
                        {header}
                        <button
                            className="action close-btn" onClick={toggleIsPopupOpen}
                        >X</button>
                    </header>

                    <main className="popup-main">
                        {children}
                    </main>

                    <footer className="popup-footer">
                        {footer}
                    </footer>
                </div>
            </section>
        </div>
    )
}