export function Popup({ header, footer, toggleIsPopupOpen, children, isPopupOpen }) {
    return (
        <div className={`popup-black-wrapper ${isPopupOpen ? "open" : ""}`} onClick={toggleIsPopupOpen}>
            <section className="popup" onClick={(event) => event.stopPropagation()}>


                <header className="popup-header">
                    {header}
                    <button className="close-btn" onClick={toggleIsPopupOpen}>X</button>
                </header>

                <main className="popup-main">
                    {children}
                </main>

                <footer className="popup-footer">
                    {footer}
                </footer>
            </section>
        </div>
    )
}