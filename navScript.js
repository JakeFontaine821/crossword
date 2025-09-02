const navSelectionHighlighter = document.querySelector('.nav-panel .selection-highlight');
const navButtons = document.querySelectorAll('.nav-panel .button');

for(const [i, button] of navButtons.entries()){
    button.addEventListener('click', () => {
        navSelectionHighlighter.style.top = `${(i * 60) + 15}px`;
    });
}