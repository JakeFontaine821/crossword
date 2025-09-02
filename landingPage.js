class landingPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('landing-page', 'page');

        this.innerHTML = `
            Hello :)
            This is my page, games are on the left
        `;
    };
};
customElements.define('landing-page', landingPage);