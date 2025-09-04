class winPopup extends HTMLElement{
    constructor(){
        super();

        this.classList.add('win-popup', 'popup', 'hidden');

        this.innerHTML = `
            <div class="popup-container">
                <div class="close-button"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></div>
                <div class="header">You Win!</div>
                <div class="time">00:00</div>
                <!-- TODO set an input box to put a name for when posting score to the server -->
            </div>
        `;

        // close the panel
        this.querySelector('.close-button').addEventListener('click', () => this.classList.add('hidden'));
    };

    setTime(time){
        this.querySelector('.time').innerHTML = time;
    };
};
customElements.define('win-popup', winPopup);