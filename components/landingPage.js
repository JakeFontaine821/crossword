class landingPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('landing-page', 'page');

        this.innerHTML = `
            <div class="page-container">
                <div class="header-row">Free NYTimes Games</div>
                <div class="leaderboard-section">
                    <div class="mini-leaderboards-container">
                        <div class="mini-daily-board">
                            <b>Today's Leaderboard</b>
                            <div class=" leaderboard-outer" style="border-right: 1px solid black">
                                <div class="leaderboard-inner"></div>
                            </div>
                        </div>

                        <div class="mini-leaderboard">
                            <b>All Time Leaderboard</b>
                            <div class="leaderboard-outer">
                                <div class="leaderboard-inner"></div>
                            </div>
                        </div>
                    </div>
                    <!-- Other leaderboarders here -->
                </div>
            </div>
        `;

        (async () => {
            /**********************************************************************************************************************/
            /*                         LOAD IN THE DAILY LEADERBOARD                                                              */
            /**********************************************************************************************************************/
            let mini_dailyBoardFetch;
            let mini_dailyBoardJson;
            while (!mini_dailyBoardJson?.success) {
                try{
                    // const response = await fetch('http://localhost:62999/nytimes/mini/times/today');
                    const response = await fetch('https://server-lkt6.onrender.com/nytimes/mini/times/today');
                    // const response = await fetch('http://kmontambault.freeddns.org:62999/nyt/nytimes/mini/times/today');
                    if(!response.ok){ throw new Error(`HTTP error, Status: ${response.status}`); };
                    mini_dailyBoardFetch = response;

                    mini_dailyBoardJson = await mini_dailyBoardFetch.json();
                    if(!mini_dailyBoardJson.success){ throw new Error(`Failed fetching from server: ${mini_dailyBoardJson.error}`); }
                }
                catch (err){
                    console.error('Api call failed, retrying in 5s...', err);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }

            // Sort the entries for the day list
            // The database doesnt do any sorting for the day list, it keeps them sequentual, still debating this
            const sortedEntries = mini_dailyBoardJson.data.sort((a, b) => a.time - b.time);

            // Load into frontend
            const dailyboardInner = this.querySelector('.mini-daily-board .leaderboard-inner');
            for(const [i, entry] of sortedEntries.entries()){
                const newEntry = new leaderboardEntry(entry, i+1);
                dailyboardInner.appendChild(newEntry);
            }

            /**********************************************************************************************************************/
            /*                         LOAD IN THE ALL TIME LEADERBOARD                                                           */
            /**********************************************************************************************************************/
            let mini_leaderBoardFetch;
            let mini_leaderBoardJson;
            while (!mini_leaderBoardJson?.success) {
                try{
                    // const response = await fetch('http://localhost:62999/nytimes/mini/times/leaderboard');
                    const response = await fetch('https://server-lkt6.onrender.com/nytimes/mini/times/leaderboard');
                    // const response = await fetch('http://kmontambault.freeddns.org:62999/nyt/nytimes/mini/times/leaderboard');
                    if(!response.ok){ throw new Error(`HTTP error, Status: ${response.status}`); };
                    mini_leaderBoardFetch = response;

                    mini_leaderBoardJson = await mini_leaderBoardFetch.json();
                    if(!mini_leaderBoardJson.success){ throw new Error(`Failed fetching from server: ${mini_leaderBoardJson.error}`); }
                }
                catch (err){
                    console.error('Api call failed, retrying in 5s...', err);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }

            // Load into frontend
            const leaderboardInner = this.querySelector('.mini-leaderboard .leaderboard-inner');
            for(const [i, entry] of mini_leaderBoardJson.data.entries()){
                const newEntry = new leaderboardEntry(entry, i+1, true);
                leaderboardInner.appendChild(newEntry);
            }
        })();
    };

    show(){
        this.classList.remove('hidden');
    };

    hide(){
        this.classList.add('hidden');
    };
};
customElements.define('landing-page', landingPage);