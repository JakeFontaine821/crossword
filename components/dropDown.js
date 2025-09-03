class DropDown extends HTMLElement{
    constructor(){
        super();

        this.classList.add('drop-down');

        this.innerHTML = `
            <div class="header">${this.getAttribute('header')}</div>
            <div class="dropdown-container hidden"></div>
        `;

        const header = this.querySelector('.header');
        const dropdownContainer = this.querySelector('.dropdown-container');
        header.addEventListener('click', () => {
            dropdownContainer.classList.remove('hidden');

            window.addEventListener('pointerup', () => {
                dropdownContainer.classList.add('hidden');
            }, { once: true });
        });

        const optionsAttributes = this.getAttribute('options').split(',');
        for(const option of optionsAttributes){
            const newDiv = document.createElement('div');
            newDiv.classList.add('option');
            newDiv.innerHTML = option;

            const eventName = option.toLowerCase();
            newDiv.addEventListener('click', () => this.dispatchEvent(new Event(eventName)));

            dropdownContainer.appendChild(newDiv);
        }
    };
};
customElements.define('drop-down', DropDown);