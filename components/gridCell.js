class GridCell extends HTMLElement{
    constructor(cellObject){
        super();

        this.classList.add('grid-cell');
        this.classList.toggle('blank', !cellObject.type);

        this.innerHTML = cellObject.type ? `
            <div class="label">${cellObject.label ?? ''}</div>
            <div class="value"></div>
            <div class="revealed-flag hidden"><svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="95" fill="#33c"/><circle cx="100" cy="100" r="50" fill="#000"/></svg></div>
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
        if(!this.classList.contains('checked-correct')){ this.querySelector('.value').innerHTML = newValue; }
        this.dispatchEvent(new Event('input'));
        this.classList.remove('checked-incorrect');
    };

    clear(emit=false){
        if(this.value && !this.classList.contains('checked-correct')){
            this.querySelector('.value').innerHTML = '';

            this.classList.remove('checked-correct');
            this.classList.remove('checked-incorrect');
            return;
        }
        
        if(emit){ this.dispatchEvent(new Event('backspace')); }
    };

    checkAnswer(){
        return this.classList.contains('blank') ? true : this.value === this.answer;
    };

    userCheck(){
        if(this.classList.contains('blank') || !this.value){ return; }

        const correct = this.checkAnswer();
        this.classList.toggle('checked-correct', correct);
        this.classList.toggle('checked-incorrect', !correct);
    };

    reveal(){
        if(this.classList.contains('blank')){ return; }

        this.querySelector('.revealed-flag').classList.remove('hidden');
        this.classList.add('checked-correct');
        this.querySelector('.value').innerHTML = this.answer;
        this.dispatchEvent(new Event('input'));
    };
};
customElements.define('grid-cell', GridCell);