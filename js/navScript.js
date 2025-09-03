const navSelectionHighlighter = document.querySelector('.nav-panel .selection-highlight');
const navContainer = document.querySelector('.nav-panel');

for(const [i, button] of Array.from(navContainer.children).entries()){
    button.addEventListener('click', () => {
        if(button.classList.contains('selected')){ return; }

        const currentButton = navContainer.querySelector('.selected');
        currentButton.classList.remove('selected');
        
        const currentPage = document.querySelector(`.page.${currentButton.getAttribute('page')}-page`);
        currentPage.hide();

        navSelectionHighlighter.style.top = `${(i * 60) + 15}px`;
        button.classList.add('selected');

        const newPage = document.querySelector(`.page.${button.getAttribute('page')}-page`);
        newPage.show();
    });
}