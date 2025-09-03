class DailyPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('daily-page', 'page', 'hidden');

        this.innerHTML = `
            <div class="header-row">Daily Crossword :)</div>
            <div class="config-row">00:00</div>
            <div class="game-section">
                <div class="grid-section">
                    <div class="current-clue"></div>
                    <div class="grid-container"></div>
                </div>
                <div class="across-list list-container">
                    <div class="list-title"><b>Across</b></div>
                    <div class="list-outer">
                        <div class="list-inner"></div>
                    </div>
                </div>
                <div class="down-list list-container">
                    <div class="list-title"><b>Down</b></div>
                    <div class="list-outer">
                        <div class="list-inner"></div>
                    </div>
                </div>
            </div>
        `;
    };

    show(){
        this.classList.remove('hidden');
    };

    hide(){
        this.classList.add('hidden');
    };
};
customElements.define('daily-page', DailyPage);