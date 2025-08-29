document.addEventListener('keydown', (e) => {
    if(!/^[a-zA-Z]$/.test(e.key)){ return; }

    document.querySelector('grid-cell.selected').value = e.key.toUpperCase();
});