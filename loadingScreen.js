class loadingScreen extends HTMLElement{
    constructor(){
        super();

        this.classList.add('loading-screen');

        this.innerHTML = `
            <div class="spinner" title="Its still loading I promise 😭"></div>
            <div class="text"></div>
        `;

        const textElement = this.querySelector('.text');
        const waitingMessages = [
            'Maybe get some popcorn?',
            'Magic needs time',
            'Summoning the hamsters to power this thing',
            'Warming up the servers (they\'re shy)',
            'Whispering sweet nothings to the database',
            'Doing a little interpretive dance in the background',
            'Borrowing bandwidth from the neighbor\'s Wi-Fi',
            'Threatening the server with a stern email',
            'Asking nicely for the code to work',
            'Giving the database a pep talk',
            'Whispering encouragement to the progress bar',
            'Calming the code down after a panic attack',
            'Petting the server so it doesn\'t crash',
            'Praying the last update didn’t break everything',
            'Running in circles until something works',
            'Taking a moment to appreciate your patience',
            'Telling the progress bar it’s doing great',
            'Doesn\'t work great under pressure',
            'Turning it off and on again… in spirit',
            'Convincing the app that it’s loved',
            'Taking a scenic route',
            'Waiting for the hamster union to approve overtime',
            'Asking fate for faster loading',
            'What if I just started your time right now :)',
            'Just stalling so you’ll notice this text',
            'Might add a timeout in the future so people see these more often',
        ];
        const messageTime = 5; // seconds

        const setWaitText = () => textElement.innerHTML = waitingMessages[Math.floor(Math.random() * waitingMessages.length)];
        setWaitText();

        const messageCycleInterval = setInterval(() => {
            if(!this.classList.contains('hidden')){
                setWaitText();
                return;
            }

            window.clearInterval(messageCycleInterval);
        }, messageTime * 1000);
    };
};
customElements.define('loading-screen', loadingScreen);