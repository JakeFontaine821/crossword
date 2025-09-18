class leaderboardEntry extends HTMLElement{
    constructor(entryData, place=0, showDate=false){
        super();

        this.classList.add('leaderboard-entry');
        console.log(entryData)
        const [year, month, day] = entryData.dateString.split("-").map(Number);
        const parsedDate = new Date(Date.UTC(year, month - 1, day + 1));

        this.innerHTML = `
            ${place === 1 ? '<div class="place-container"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#7db8f7" stroke="#000" stroke-width="4" stroke-linejoin="round" d="m40 63-18 38 18-5 10 18 14-37zm44 1 16 37-14-2-10 15-12-37z"/><circle cx="64" cy="48" r="36" fill="gold" stroke="#000" stroke-width="4"/><circle cx="64" cy="48" r="24" fill="#FFED8A" stroke="#000" stroke-width="4"/><text x="64" y="56" font-size="24" font-family="Arial, sans-serif" text-anchor="middle" font-weight="bold">1</text></svg></div>' : ''}
            ${place === 2 ? '<div class="place-container"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#7db8f7" stroke="#000" stroke-width="4" stroke-linejoin="round" d="m40 63-18 38 18-5 10 18 14-37zm44 1 16 37-14-2-10 15-12-37z"/><circle cx="64" cy="48" r="36" fill="silver" stroke="#000" stroke-width="4"/><circle cx="64" cy="48" r="24" fill="#fffaf8" stroke="#000" stroke-width="4"/><text x="64" y="56" font-size="24" font-family="Arial, sans-serif" text-anchor="middle" font-weight="bold">2</text></svg></div>' : ''}
            ${place === 3 ? '<div class="place-container"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#cc3f3f" stroke="#000" stroke-width="4" stroke-linejoin="round" d="m40 63-18 38 18-5 10 18 14-37zm44 1 16 37-14-2-10 15-12-37z"/><circle cx="64" cy="48" r="36" fill="#CD7F32" stroke="#000" stroke-width="4"/><circle cx="64" cy="48" r="24" fill="#DFAD7C" stroke="#000" stroke-width="4"/><text x="64" y="56" font-size="24" font-family="Arial, sans-serif" text-anchor="middle" font-weight="bold">3</text></svg></div>' : ''}
            ${place < 1 || place > 3 ? `<div class="place-container">${place}</div>` : ''}
            <div class="name">${entryData.name}</div>
            <div class="name">${formatSecondsToHMS(entryData.time)}</div>
            <div class="date-scored ${showDate ? '' : 'hidden'}">${parsedDate.toDateString()}</div>
            <div class="checks-used ${showDate ? 'hidden' : ''}">${entryData.checksUsed} checks used</div>
        `;
    };
};
customElements.define('leaderboard-entry', leaderboardEntry);