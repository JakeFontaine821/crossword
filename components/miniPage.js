class MiniPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('mini-page', 'page', 'hidden');

        this.innerHTML = `
            <div class="page-container">
                <div class="header-row">Mini Crossword :)</div>
                <div class="config-row">
                    <div class="timer-display">00:00</div>
                    <div class="pause-button"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M360-320h80v-320h-80v320Zm160 0h80v-320h-80v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></div>
                    
                    <div class="dropdown-section">
                        <drop-down class="reveal-dropdown" header="Reveal" options="Cell,Word,Puzzle"></drop-down>
                        <drop-down class="check-dropdown" header="Check" options="Cell,Word,Puzzle"></drop-down>
                    </div>
                </div>
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
                <pause-popup></pause-popup>
                <win-popup></win-popup>
            </div>
        `;

        (async () => {
            let apiCall;

            while (!apiCall) {
                try{
                    const response = await fetch('https://server-lkt6.onrender.com/nytimes/mini');
                    if(!response.ok){ throw new Error(`HTTP error, Status: ${response.status}`) };

                    apiCall = response;
                }
                catch (err){
                    console.error('Api call failed, retrying in 5s...', err);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }

            // const apiCall = await fetch('https://server-lkt6.onrender.com/nytimes/min');
            const miniJson = await apiCall.json();
            // if(!miniJson.success){ return document.querySelector('.loading-screen').setErrorText('Fetch failed - reload the page'); }
            const dataBody = miniJson.data.body[0];
            // if(!dataBody){ return document.querySelector('.loading-screen').setErrorText('Failed to parse data object - reload the page'); }

            // When clue row is clicked display info here
            const currentClueDisplay = this.querySelector('.current-clue');
            this.clueElements = [];
            this.cellArray = [];
            let direction = 0; // 1 for down

            const selectClue = (clueElement, keepSelectedCell=false) => {
                // Set the highlighted cells
                for(const cell of this.querySelectorAll('.grid-cell.highlighted')){ cell.classList.remove('highlighted'); }
                for(const cellIndex of clueElement.cells){ this.cellArray[cellIndex].classList.add('highlighted'); }

                // Selecting new set of cell, see if current selected cell is in row/column
                let selectedCellInClueCells = keepSelectedCell ? clueElement.cells.map(cellIndex => this.cellArray[cellIndex]).find(cellElement => cellElement.classList.contains('selected')) : null;

                // Check to see if we need to change the selected cell to the first blank cell in row/column
                if(!selectedCellInClueCells){
                    for(const cell of this.querySelectorAll('.grid-cell.selected')){ cell.classList.remove('selected'); }
                    for(const cellIndex of clueElement.cells){
                        if(!this.cellArray[cellIndex].value){
                            this.cellArray[cellIndex].classList.add('selected');
                            selectedCellInClueCells = this.cellArray[cellIndex];
                            break;
                        }
                    }
                }

                // selected cells is still null cause every cell in the new element is set already, just selected the first one
                if(!selectedCellInClueCells){
                    this.cellArray[clueElement.cells[0]].classList.add('selected');
                    selectedCellInClueCells = this.cellArray[clueElement.cells[0]];
                }

                // Highlight clues
                for(const clueElement of this.clueElements){ clueElement.classList.remove('highlighted', 'kinda-highlighted'); }
                this.clueElements[selectedCellInClueCells.clues[0]].classList.add(!direction ? 'highlighted' : 'kinda-highlighted');
                this.clueElements[selectedCellInClueCells.clues[1]].classList.add(direction ? 'highlighted' : 'kinda-highlighted');

                // Set the clue text
                currentClueDisplay.innerHTML = `${clueElement.label} - ${clueElement.text}`;
            };

            // Add the clues to the respective lists
            const acrossList = this.querySelector('.across-list .list-inner');
            const downList = this.querySelector('.down-list .list-inner');
            for(const clueObject of dataBody.clues){
                const newClueRow = new ClueRow(clueObject);
                this.clueElements.push(newClueRow);

                newClueRow.addEventListener('click', () => {
                    if(newClueRow.classList.contains('highlighted')){ return; }

                    direction = newClueRow.direction;
                    selectClue(newClueRow);
                });

                if(clueObject.direction === 'Across'){ acrossList.appendChild(newClueRow); continue; }
                downList.appendChild(newClueRow);
            }
            
            // Create a function for switching the direction of the selected word to be used for double clicking a square and hitting tab
            const switchDirection = () => {
                direction = direction ? 0 : 1;
                selectClue(this.clueElements.find(element => element.classList.contains('kinda-highlighted')), true);
            };

            // Create the grid
            let cellIndex = 0;
            const gridContainer = this.querySelector('.grid-container');
            for (let i = 0; i < dataBody.dimensions.height; i++) {
                const gridRow = document.createElement('div');
                gridRow.classList.add('grid-row');

                for (let i = 0; i < dataBody.dimensions.width; i++) {
                    const newCell = new GridCell(dataBody.cells[cellIndex]);
                    this.cellArray.push(newCell);

                    newCell.addEventListener('click', () => {
                        if(newCell.classList.contains('blank')){ return; }

                        for(const cell of this.querySelectorAll('.grid-cell.selected')){ cell.classList.remove('selected'); }

                        newCell.classList.add('selected');
                        selectClue(this.clueElements[newCell.clues[direction]], true);
                    });

                    newCell.addEventListener('dblclick', () => switchDirection());

                    newCell.addEventListener('input', () => {
                        const falseCell = this.cellArray.some(cell => !cell.checkAnswer());

                        // PLAYER WINS
                        if(!falseCell){
                            this.stopTime(false);

                            const winPopup = this.querySelector('.win-popup');
                            winPopup.setTime(this.querySelector('.timer-display').innerHTML);
                            winPopup.classList.remove('hidden');
                        }

                        const highlightedCells = Array.from(this.querySelectorAll('.grid-cell.highlighted'));
                        const indexOfSelectedCell = highlightedCells.findIndex(cell => cell === newCell);

                        // if not at the end of the word go to the next cell in the word
                        if(indexOfSelectedCell >= highlightedCells.length-1){ return; }

                        // select next letter that is not set
                        for (let i = indexOfSelectedCell+1; i < highlightedCells.length; i++) {
                            if(highlightedCells[i].value){ continue; }
                            
                            newCell.classList.remove('selected');
                            highlightedCells[i].classList.add('selected');
                            selectClue(this.clueElements[newCell.clues[direction]], true);
                            break;
                        }
                    });

                    newCell.addEventListener('backspace', () => {
                        const highlightedCells = Array.from(this.querySelectorAll('.grid-cell.highlighted'));
                        const indexOfSelectedCell = highlightedCells.findIndex(cell => cell === newCell);

                        // if not on the first cell go backwards to the previous cell in the word
                        if(!indexOfSelectedCell){ return; }
                        newCell.classList.remove('selected');
                        highlightedCells[indexOfSelectedCell-1].classList.add('selected');
                        highlightedCells[indexOfSelectedCell-1].clear(false);
                    });

                    gridRow.appendChild(newCell);
                    cellIndex++;
                }

                gridContainer.appendChild(gridRow);
            }

            // Select the first clue
            selectClue(this.clueElements[0]);

            // Setup play timer variables
            this.elapsedMilliseconds = 0;
            this.playTime = 0;

            // Setup pause and resume functionality
            const pausePopup = this.querySelector('.pause-popup');
            this.querySelector('.pause-button').addEventListener('click', () => {
                if(!this.playing){ return; }

                pausePopup.classList.remove('hidden');
                this.stopTime();
            });
            pausePopup.addEventListener('resume', () => {
                pausePopup.classList.add('hidden');
                this.startTime();
            });

            // Define player input
            document.addEventListener('keydown', (e) => {
                if(this.classList.contains('hidden')){ return; }

                // Player input for selected square
                if(/^[a-zA-Z]$/.test(e.key)){
                    if(this.playing){ this.querySelector('.grid-cell.selected').value = e.key.toUpperCase(); }
                    return;
                }

                // Remove the value from the current selected cell and move one square back in the selected word
                if(e.key === 'Backspace'){
                    if(this.playing){ this.querySelector('grid-cell.selected').clear(true); }
                    return;
                }

                // Switch the direction and set the new selected clue
                if(e.key === 'Tab'){
                    e.preventDefault();

                    switchDirection();
                    return;
                }

                // Move to the next clue
                if(e.key === 'Enter'){
                    e.preventDefault();

                    const currentClueIndex = this.clueElements.findIndex(element => element.classList.contains('highlighted'));
                    const newClueElement = this.clueElements[(currentClueIndex+1) % this.clueElements.length];

                    direction = newClueElement.direction;
                    selectClue(newClueElement);
                    return;
                }
            });

            // Setup reveal functions
            const revealDropdown = this.querySelector('.reveal-dropdown');
            revealDropdown.addEventListener('cell', () => {
                if(!this.playing){ return; }
                this.querySelector('.grid-cell.selected').reveal();
            });
            revealDropdown.addEventListener('word', () => {
                if(!this.playing){ return; }
                for(const cell of this.querySelectorAll('.grid-cell.highlighted')){ cell.reveal(); }
            });
            revealDropdown.addEventListener('puzzle', () => {
                if(!this.playing){ return; }
                for(const cell of this.cellArray){ cell.reveal(); }
            });

            // Setup check functions
            const checkDropdown = this.querySelector('.check-dropdown');
            checkDropdown.addEventListener('cell', () => {
                if(!this.playing){ return; }
                this.querySelector('.grid-cell.selected').userCheck();
            });
            checkDropdown.addEventListener('word', () => {
                if(!this.playing){ return; }
                for(const cell of this.querySelectorAll('.grid-cell.highlighted')){ cell.userCheck(); }
            });
            checkDropdown.addEventListener('puzzle', () => {
                if(!this.playing){ return; }
                for(const cell of this.cellArray){ cell.userCheck(); }
            });

            this.dispatchEvent(new Event('loaded'));
        })();
    };

    startTime(){
        if(this.timer){ return; }

        this.lastCheckedTime = Date.now();
        this.timer = setInterval(() => {
            const now = Date.now();
            this.elapsedMilliseconds += now - this.lastCheckedTime;
            this.lastCheckedTime = now;

            if(this.elapsedMilliseconds >= 1000){
                this.playTime += Math.floor(this.elapsedMilliseconds / 1000);
                this.elapsedMilliseconds = this.elapsedMilliseconds % 1000;

                // Update UI
                const hours = `${Math.floor(this.playTime / 3600)}`.padStart(2, '0');
                const minutes = `${Math.floor(this.playTime / 60) % 60}`.padStart(2, '0');
                const seconds = `${this.playTime % 60}`.padStart(2, '0');
                this.querySelector('.timer-display').innerHTML = `${Math.floor(this.playTime / 3600) ? `${hours}:` : ''}${minutes}:${seconds}`;
            }
        }, 1000/60);

        for(const clueElement of this.clueElements){ clueElement.classList.remove('hidden'); }

        this.playing = true;
    };

    stopTime(hideClues=true){
        if(!this.timer){ return; }

        window.clearInterval(this.timer);
        this.timer = null;

        if(hideClues){
            for(const clueElement of this.clueElements){ clueElement.classList.add('hidden'); }
        }

        this.playing = false;
    };

    show(){
        this.startTime();
        this.classList.remove('hidden');
    };

    hide(){
        this.stopTime();
        this.classList.add('hidden');
    };
};
customElements.define('mini-page', MiniPage);