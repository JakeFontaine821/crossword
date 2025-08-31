const gamePageClasses = ['mini', 'daily'];
const navButtons = document.querySelector('.nav-panel').children;
const gamePages = Array.from(document.querySelectorAll('.game-page'));
for(const navButton of navButtons){
    navButton.addEventListener('click', () => {
        if(navButton.classList.contains('selected')){ return; }

        // clear page
        for(const button of navButtons){ button.classList.remove('selected'); }
        for(const page of gamePages){ page.classList.add('hidden'); }

        navButton.classList.add('selected');
        gamePages.find(page => page.classList.contains(navButton.getAttribute('page'))).classList.remove('hidden');
    });
}

/**********************************************************************************************************************************/
/*                                            LOAD THE MINI CROSSWORD                                                             */
/**********************************************************************************************************************************/
(async () => {
    // await new Promise(resolve => setTimeout(() => resolve(), 25000));

    const publicAPICall = await fetch('https://server-lkt6.onrender.com/nytimes/mini');
    const miniJson = await publicAPICall.json();
    if(!miniJson.success){ return document.querySelector('.loading-screen').setErrorText('Fetch failed - reload the page'); }

    const miniData = miniJson.data;
    const dataBody = miniData.body[0];
    if(!miniData || !dataBody){ return document.querySelector('.loading-screen').setErrorText('Failed to parse data object - reload the page'); }

    // When clue row is clicked display info here
    const currentClueDisplay = document.querySelector('.mini .current-clue');
    const clueElements = [];
    const cellArray = [];
    let direction = 0; // 1 for down

    function selectClue(clueElement, keepSelectedCell=false){
        // Set the highlighted cells
        for(const cell of document.querySelectorAll('.mini .grid-cell.highlighted')){ cell.classList.remove('highlighted'); }
        for(const cellIndex of clueElement.cells){ cellArray[cellIndex].classList.add('highlighted'); }

        // Selecting new set of cell, see if current selected cell is in row/column
        let selectedCellInClueCells = keepSelectedCell ? clueElement.cells.map(cellIndex => cellArray[cellIndex]).find(cellElement => cellElement.classList.contains('selected')) : null;

        // Check to see if we need to change the selected cell to the first blank cell in row/column
        if(!selectedCellInClueCells){
            for(const cell of document.querySelectorAll('.mini .grid-cell.selected')){ cell.classList.remove('selected'); }
            for(const cellIndex of clueElement.cells){
                if(!cellArray[cellIndex].value){
                    cellArray[cellIndex].classList.add('selected');
                    selectedCellInClueCells = cellArray[cellIndex];
                    break;
                }
            }
        }

        // selected cells is still null cause every cell in the new element is set already, just selected the first one
        if(!selectedCellInClueCells){
            cellArray[clueElement.cells[0]].classList.add('selected');
            selectedCellInClueCells = cellArray[clueElement.cells[0]];
        }

        // Highlight clues
        for(const clueElement of clueElements){ clueElement.classList.remove('highlighted', 'kinda-highlighted'); }
        clueElements[selectedCellInClueCells.clues[0]].classList.add(!direction ? 'highlighted' : 'kinda-highlighted');
        clueElements[selectedCellInClueCells.clues[1]].classList.add(direction ? 'highlighted' : 'kinda-highlighted');

        // Set the clue text
        currentClueDisplay.innerHTML = `${clueElement.label} - ${clueElement.text}`;
    };

    // Add the clues to the respective lists
    const acrossList = document.querySelector('.mini .across-list .list-inner');
    const downList = document.querySelector('.mini .down-list .list-inner');
    for(const clueObject of dataBody.clues){
        const newClueRow = new ClueRow(clueObject);
        clueElements.push(newClueRow);

        newClueRow.addEventListener('click', () => {
            if(newClueRow.classList.contains('highlighted')){ return; }

            direction = newClueRow.direction;
            selectClue(newClueRow);
        });

        if(clueObject.direction === 'Across'){ acrossList.appendChild(newClueRow); continue; }
        downList.appendChild(newClueRow);
    }

    // Create the grid
    let cellIndex = 0;
    const gridContainer = document.querySelector('.mini .grid-container');
    for (let i = 0; i < dataBody.dimensions.height; i++) {
        const gridRow = document.createElement('div');
        gridRow.classList.add('grid-row');

        for (let i = 0; i < dataBody.dimensions.width; i++) {
            const newCell = new GridCell(dataBody.cells[cellIndex]);
            cellArray.push(newCell);

            newCell.addEventListener('click', () => {
                if(newCell.classList.contains('blank')){ return; }

                for(const cell of document.querySelectorAll('.mini .grid-cell.selected')){ cell.classList.remove('selected'); }
                // for(const cell of document.querySelectorAll('.mini .grid-cell.highlighted')){ cell.classList.remove('highlighted'); }

                newCell.classList.add('selected');
                selectClue(clueElements[newCell.clues[direction]], true);
            });

            newCell.addEventListener('input', () => {
                const falseCell = cellArray.some(cell => !cell.checkAnswer());
                if(!falseCell){ console.log('you win :)'); }

                const highlightedCells = Array.from(document.querySelectorAll('.mini .grid-cell.highlighted'));
                const indexOfSelectedCell = highlightedCells.findIndex(cell => cell === newCell);

                // if not at the end of the word go to the next cell in the word
                if(indexOfSelectedCell >= highlightedCells.length-1){ return; }
                newCell.classList.remove('selected');
                highlightedCells[indexOfSelectedCell+1].classList.add('selected');
                selectClue(clueElements[newCell.clues[direction]], true);
            });

            newCell.addEventListener('backspace', () => {
                const highlightedCells = Array.from(document.querySelectorAll('.mini .grid-cell.highlighted'));
                const indexOfSelectedCell = highlightedCells.findIndex(cell => cell === newCell);

                // if not on the first cell go backwards to the previous cell in the word
                if(!indexOfSelectedCell){ return; }
                newCell.classList.remove('selected');
                highlightedCells[indexOfSelectedCell-1].classList.add('selected');
            });

            gridRow.appendChild(newCell);
            cellIndex++;
        }

        gridContainer.appendChild(gridRow);
    }

    // Select the first clue
    selectClue(clueElements[0]);

    // Setup play timer
    let elapsedTime = 0;
    const configRow = document.querySelector('.mini .config-row');
    const timer = setInterval(() => {
        elapsedTime++;

        const hours = `${Math.floor(elapsedTime / 3600)}`.padStart(2, '0');
        const minutes = `${Math.floor(elapsedTime / 60) % 60}`.padStart(2, '0');
        const seconds = `${elapsedTime % 60}`.padStart(2, '0');
        configRow.innerHTML = `${Math.floor(elapsedTime / 3600) ? `${hours}:` : ''}${minutes}:${seconds}`;
    }, 1000);

    // Define player input
    document.addEventListener('keydown', (e) => {
        // Player input for selected square
        if(/^[a-zA-Z]$/.test(e.key)){
            document.querySelector('.mini grid-cell.selected').value = e.key.toUpperCase();
            return;
        }

        // Remove the value from the current selected cell and move one square back in the selected word
        if(e.key === 'Backspace'){
            document.querySelector('.mini grid-cell.selected').clear();
            return;
        }

        // Switch the direction and set the new selected clue
        if(e.key === 'Tab'){
            e.preventDefault();

            direction = direction ? 0 : 1;
            selectClue(clueElements.find(element => element.classList.contains('kinda-highlighted')), true);
            return;
        }

        // Move to the next clue
        if(e.key === 'Enter'){
            e.preventDefault();

            const currentClueIndex = clueElements.findIndex(element => element.classList.contains('highlighted'));
            const newClueElement = clueElements[(currentClueIndex+1) % clueElements.length];

            direction = newClueElement.direction;
            selectClue(newClueElement);
            return;
        }
    });

    // Remove loading screen
    document.querySelector('.loading-screen').classList.add('hidden');
})();


/**********************************************************************************************************************************/
/*                                            LOAD THE DAILY CROSSWORD                                                            */
/**********************************************************************************************************************************/
(async () => {
    // await new Promise(resolve => setTimeout(() => resolve(), 25000));

    const publicAPICall = await fetch('https://server-lkt6.onrender.com/nytimes/daily');
    const dailyJson = await publicAPICall.json();
    if(!dailyJson.success){ return document.querySelector('.loading-screen').setErrorText('Fetch failed - reload the page'); }

    const dailyData = dailyJson.data;
    const dataBody = dailyData.body[0];
    if(!dailyData || !dataBody){ return document.querySelector('.loading-screen').setErrorText('Failed to parse data object - reload the page'); }

    // When clue row is clicked display info here
    const currentClueDisplay = document.querySelector('.daily .current-clue');
    const clueElements = [];
    const cellArray = [];
    let direction = 0; // 1 for down

    function selectClue(clueElement, keepSelectedCell=false){
        // Set the highlighted cells
        for(const cell of document.querySelectorAll('.daily .grid-cell.highlighted')){ cell.classList.remove('highlighted'); }
        for(const cellIndex of clueElement.cells){ cellArray[cellIndex].classList.add('highlighted'); }

        // Selecting new set of cell, see if current selected cell is in row/column
        let selectedCellInClueCells = keepSelectedCell ? clueElement.cells.map(cellIndex => cellArray[cellIndex]).find(cellElement => cellElement.classList.contains('selected')) : null;

        // Check to see if we need to change the selected cell to the first blank cell in row/column
        if(!selectedCellInClueCells){
            for(const cell of document.querySelectorAll('.daily .grid-cell.selected')){ cell.classList.remove('selected'); }
            for(const cellIndex of clueElement.cells){
                if(!cellArray[cellIndex].value){
                    cellArray[cellIndex].classList.add('selected');
                    selectedCellInClueCells = cellArray[cellIndex];
                    break;
                }
            }
        }

        // selected cells is still null cause every cell in the new element is set already, just selected the first one
        if(!selectedCellInClueCells){
            cellArray[clueElement.cells[0]].classList.add('selected');
            selectedCellInClueCells = cellArray[clueElement.cells[0]];
        }

        // Highlight clues
        for(const clueElement of clueElements){ clueElement.classList.remove('highlighted', 'kinda-highlighted'); }
        clueElements[selectedCellInClueCells.clues[0]].classList.add(!direction ? 'highlighted' : 'kinda-highlighted');
        clueElements[selectedCellInClueCells.clues[1]].classList.add(direction ? 'highlighted' : 'kinda-highlighted');

        // Set the clue text
        currentClueDisplay.innerHTML = `${clueElement.label} - ${clueElement.text}`;
    };

    // Add the clues to the respective lists
    const acrossList = document.querySelector('.daily .across-list .list-inner');
    const downList = document.querySelector('.daily .down-list .list-inner');
    for(const clueObject of dataBody.clues){
        const newClueRow = new ClueRow(clueObject);
        clueElements.push(newClueRow);

        newClueRow.addEventListener('click', () => {
            if(newClueRow.classList.contains('highlighted')){ return; }

            direction = newClueRow.direction;
            selectClue(newClueRow);
        });

        if(clueObject.direction === 'Across'){ acrossList.appendChild(newClueRow); continue; }
        downList.appendChild(newClueRow);
    }

    // Create the grid
    let cellIndex = 0;
    const gridContainer = document.querySelector('.daily .grid-container');
    for (let i = 0; i < dataBody.dimensions.height; i++) {
        const gridRow = document.createElement('div');
        gridRow.classList.add('grid-row');

        for (let i = 0; i < dataBody.dimensions.width; i++) {
            const newCell = new GridCell(dataBody.cells[cellIndex]);
            cellArray.push(newCell);

            newCell.addEventListener('click', () => {
                if(newCell.classList.contains('blank')){ return; }

                for(const cell of document.querySelectorAll('.daily .grid-cell.selected')){ cell.classList.remove('selected'); }
                // for(const cell of document.querySelectorAll('.daily .grid-cell.highlighted')){ cell.classList.remove('highlighted'); }

                newCell.classList.add('selected');
                selectClue(clueElements[newCell.clues[direction]], true);
            });

            newCell.addEventListener('input', () => {
                const falseCell = cellArray.some(cell => !cell.checkAnswer());
                if(!falseCell){ console.log('you win :)'); }

                const highlightedCells = Array.from(document.querySelectorAll('.daily .grid-cell.highlighted'));
                const indexOfSelectedCell = highlightedCells.findIndex(cell => cell === newCell);

                // if not at the end of the word go to the next cell in the word
                if(indexOfSelectedCell >= highlightedCells.length-1){ return; }
                newCell.classList.remove('selected');
                highlightedCells[indexOfSelectedCell+1].classList.add('selected');
                selectClue(clueElements[newCell.clues[direction]], true);
            });

            newCell.addEventListener('backspace', () => {
                const highlightedCells = Array.from(document.querySelectorAll('.daily .grid-cell.highlighted'));
                const indexOfSelectedCell = highlightedCells.findIndex(cell => cell === newCell);

                // if not on the first cell go backwards to the previous cell in the word
                if(!indexOfSelectedCell){ return; }
                newCell.classList.remove('selected');
                highlightedCells[indexOfSelectedCell-1].classList.add('selected');
            });

            gridRow.appendChild(newCell);
            cellIndex++;
        }

        gridContainer.appendChild(gridRow);
    }

    // Select the first clue
    selectClue(clueElements[0]);

    // Setup play timer
    let elapsedTime = 0;
    const configRow = document.querySelector('.daily .config-row');
    const timer = setInterval(() => {
        elapsedTime++;

        const hours = `${Math.floor(elapsedTime / 3600)}`.padStart(2, '0');
        const minutes = `${Math.floor(elapsedTime / 60) % 60}`.padStart(2, '0');
        const seconds = `${elapsedTime % 60}`.padStart(2, '0');
        configRow.innerHTML = `${Math.floor(elapsedTime / 3600) ? `${hours}:` : ''}${minutes}:${seconds}`;
    }, 1000);
})();