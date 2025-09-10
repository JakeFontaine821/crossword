class landingPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('landing-page', 'page');

        this.innerHTML = `
            <div class="page-container">
                <div class="header-row">Mini Crossword :)</div>
                <div class="leaderboard-container">
                    <div class="mini-daily-board"></div>
                    <div class="mini-leaderboard"></div>
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
customElements.define('landing-page', landingPage);