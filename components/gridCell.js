class GridCell extends HTMLElement{
    constructor(cellObject){
        super();

        this.classList.add('grid-cell');
        this.classList.toggle('blank', !cellObject.type);

        this.innerHTML = cellObject.type ? `
            <div class="label">${cellObject.label ?? ''}</div>
            <div class="value"></div>
        ` : '';
        
        if(cellObject.type){
            this.answer = cellObject.answer;
            this.clues = cellObject.clues;
        }
    };

    get value(){
        return this.querySelector('.value').innerHTML || '';
    };

    set value(newValue){
        this.querySelector('.value').innerHTML = newValue;
        this.dispatchEvent(new Event('input'));
    };

    clear(emit=false){
        if(this.value){
            this.querySelector('.value').innerHTML = '';
            return;
        }
        
        if(emit){ this.dispatchEvent(new Event('backspace')); }
    };

    checkAnswer(){
        return this.classList.contains('blank') ? true : this.value === this.answer;
    };

    // debugging
    win(){
        if(this.classList.contains('blank')){ return; }
        this.querySelector('.value').innerHTML = this.answer;
        this.dispatchEvent(new Event('input'));
    };
};
customElements.define('grid-cell', GridCell);