class winPopup extends HTMLElement{
    constructor(){
        super();

        this.classList.add('win-popup', 'popup', 'hidden');

        this.innerHTML = `
            <div class="popup-container">
                <!-- TODO put an X button to close the popup and look at the game board -->
                <div class="header">You Win!</div>
                <div class="time">00:00</div>
                <!-- TODO set an input box to put a name for when posting score to the server -->
            </div>
        `;
    };

    setTime(time){
        this.querySelector('.time').innerHTML = time;
    };
};
customElements.define('win-popup', winPopup);