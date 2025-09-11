function getEasternDateString() {
    return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
};

function formatSecondsToHMS(seconds){
    const hours = `${Math.floor(seconds / 3600)}`.padStart(2, '0');
    const minutes = `${Math.floor(seconds / 60) % 60}`.padStart(2, '0');
    const secondss = `${seconds % 60}`.padStart(2, '0');
    return `${Math.floor(seconds / 3600) ? `${hours}:` : ''}${minutes}:${secondss}`;
};