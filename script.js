(async () => {
    const publicAPICall = await fetch('https://server-lkt6.onrender.com/nytimes/mini');
    const miniJson = await publicAPICall.json();
    if(!miniJson.success){ return console.error('Failed to Load game data'); }

    const miniData = miniJson.data;
    const dataBody = miniData.body[0];
    console.log(miniData);
    if(!miniData || !dataBody){ return console.error('Failed to parse data object'); }

    // When clue row is clicked display info here
    const currentClueDisplay = document.querySelector('.current-clue');
    const clueElements = [];
    const cellArray = [];
    let direction = 0; // 1 for down

    function selectClue(clueElement){
        // Set the highlighted cells
        for(const cell of document.querySelectorAll('.grid-cell.highlighted')){ cell.classList.remove('highlighted'); }
        for(const cellIndex of clueElement.cells){ cellArray[cellIndex].classList.add('highlighted'); }

        // Selecting new set of cell, see if current selected cell is in row/column
        let selectedCellInClueCells = clueElement.cells.map(cellIndex => cellArray[cellIndex]).find(cellElement => cellElement.classList.contains('selected'));

        // Check to see if we need to change the selected cell to the first blank cell in row/column
        if(!selectedCellInClueCells){
            for(const cell of document.querySelectorAll('.grid-cell.selected')){ cell.classList.remove('selected'); }
            for(const cellIndex of clueElement.cells){
                if(!cellArray[cellIndex].value){
                    cellArray[cellIndex].classList.add('selected');
                    selectedCellInClueCells = cellArray[cellIndex];
                    break;
                }
            }
        }

        // Highlight clues
        // console.log(selectedCellInClueCells.clues);
        for(const clueElement of clueElements){ clueElement.classList.remove('highlighted', 'kinda-highlighted'); }
        clueElements[selectedCellInClueCells.clues[0]].classList.add(!direction ? 'highlighted' : 'kinda-highlighted');
        clueElements[selectedCellInClueCells.clues[1]].classList.add(direction ? 'highlighted' : 'kinda-highlighted');

        // Set the clue text
        currentClueDisplay.innerHTML = `${clueElement.label} - ${clueElement.text}`;
    };

    // Add the clues to the respective lists
    const acrossList = document.querySelector('.across-list .list-inner');
    const downList = document.querySelector('.down-list .list-inner');
    for(const clueObject of dataBody.clues){
        const newClueRow = new ClueRow(clueObject);
        clueElements.push(newClueRow);

        newClueRow.addEventListener('click', () => {
            direction = newClueRow.direction;
            selectClue(newClueRow);
        });

        if(clueObject.direction === 'Across'){ acrossList.appendChild(newClueRow); continue; }
        downList.appendChild(newClueRow);
    }

    // Create the grid
    let cellIndex = 0;
    const gridContainer = document.querySelector('.grid-container');
    for (let i = 0; i < dataBody.dimensions.height; i++) {
        const gridRow = document.createElement('div');
        gridRow.classList.add('grid-row');

        for (let i = 0; i < dataBody.dimensions.width; i++) {
            const newCell = new GridCell(dataBody.cells[cellIndex]);
            cellArray.push(newCell);

            newCell.addEventListener('click', () => {
                for(const cell of document.querySelectorAll('.grid-cell.selected')){ cell.classList.remove('selected'); }
                // for(const cell of document.querySelectorAll('.grid-cell.highlighted')){ cell.classList.remove('highlighted'); }

                newCell.classList.add('selected');
                selectClue(clueElements[newCell.clues[direction]]);
            });

            newCell.addEventListener('input', () => {
                const falseCell = cellArray.some(cell => !cell.checkAnswer());
                if(!falseCell){ console.log('you win :)'); }

                const highlightedCells = Array.from(document.querySelectorAll('.grid-cell.highlighted'));
                const indexOfSelectedCell = highlightedCells.findIndex(cell => cell === newCell);
                if(indexOfSelectedCell !== highlightedCells.length-1){
                    newCell.classList.remove('selected');
                    highlightedCells[indexOfSelectedCell+1].classList.add('selected');
                }
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
    const configRow = document.querySelector('.config-row');
    const timer = setInterval(() => {
        elapsedTime++;

        const hours = `${Math.floor(elapsedTime / 3600)}`.padStart(2, '0');
        const minutes = `${Math.floor(elapsedTime / 60) % 60}`.padStart(2, '0');
        const seconds = `${elapsedTime % 60}`.padStart(2, '0');
        configRow.innerHTML = `${Math.floor(elapsedTime / 3600) ? `${hours}:` : ''}${minutes}:${seconds}`;
    }, 1000);
})();