class pausePopup extends HTMLElement{
    constructor(){
        super();

        this.classList.add('pause-popup', 'popup', 'hidden');

        this.innerHTML = `
            <div class="popup-container">
                <div class="header">Game Paused</div>
                <div class="resume-button">
                    Resume
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                </div>
            </div>
        `;

        this.querySelector('.resume-button').addEventListener('click', () => this.dispatchEvent(new Event('resume')));
    };
};
customElements.define('pause-popup', pausePopup);