class ClueRow extends HTMLElement{
    constructor(clueObject){
        super();

        this.classList.add('clue-row');

        this.innerHTML = `
            <div class="clue-label">${clueObject.label ?? 0}</div>
            <div class="clue">${clueObject.text[0].plain ?? 'FAILED TO LOAD CLUE'}</div>
        `;

        this.direction = clueObject.direction.slice(0, 1) === 'A' ? 0 : 1;
        this.label = `${clueObject.label}${clueObject.direction.slice(0, 1)}`;
        this.text = clueObject.text[0].plain;
        this.cells = clueObject.cells;
    };
};
customElements.define('clue-row', ClueRow);