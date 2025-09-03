class winPopup extends HTMLElement{
    constructor(){
        super();

        this.classList.add('win-popup', 'popup', 'hidden');

        this.innerHTML = `
            <div class="popup-container">
                <div class="header">You Win!</div>
                <div class="time">00:00</div>
            </div>
        `;
    };

    setTime(time){
        this.querySelector('.time').innerHTML = time;
    };
};
customElements.define('win-popup', winPopup);