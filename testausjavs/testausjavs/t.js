document.addEventListener('DOMContentLoaded', () => {
    const menuSection = document.getElementById('menu-section');
    const nameEntrySection = document.getElementById('name-entry-section');
    const cockpitSection = document.getElementById('cockpit-section');
    const mapSection = document.getElementById('map-section');
    const countryEventSection = document.getElementById('country-event-section');
    const story = document.getElementById('story');
    const storybtn = document.getElementById('storyBtn');
    const startBtn = document.getElementById('startBtn');
    const submitNameBtn = document.getElementById('submitNameBtn');
    const quitBtn = document.getElementById('quitBtn');
    const mapBtn = document.getElementById('mapBtn');
    const backToCockpitBtn = document.getElementById('backToCockpitBtn');
    const backToMapBtn = document.getElementById('backToMapBtn');
    const eventTitle = document.getElementById('event-title');
    const eventDescription = document.getElementById('event-description');
    let gameState = {
        playerName: null,
        currentCountry: null,
        visitedCountries: [],
        health: 10,
        antidotes: 0,
        totalAntidotesNeeded: 9,
        countries: [
            "FI", "SE", "NO", "EE", "LV", "LT", "PL", "SK", "HU", "AT",
            "DE", "CH", "CZ", "BE", "NL", "FR", "DK", "GB", "IE", "IS"
        ],
        countryData: {
            // Tracks data specific to each country
            FI: { eventsUsed: 0, tasksUsed: 0 },
            SE: { eventsUsed: 0, tasksUsed: 0 },
            NO: { eventsUsed: 0, tasksUsed: 0 },
            EE: { eventsUsed: 0, tasksUsed: 0 },
            LV: { eventsUsed: 0, tasksUsed: 0 },
            LT: { eventsUsed: 0, tasksUsed: 0 },
            PL: { eventsUsed: 0, tasksUsed: 0 },
            SK: { eventsUsed: 0, tasksUsed: 0 },
            HU: { eventsUsed: 0, tasksUsed: 0 },
            AT: { eventsUsed: 0, tasksUsed: 0 },
            DE: { eventsUsed: 0, tasksUsed: 0 },
            CH: { eventsUsed: 0, tasksUsed: 0 },
            CZ: { eventsUsed: 0, tasksUsed: 0 },
            BE: { eventsUsed: 0, tasksUsed: 0 },
            NL: { eventsUsed: 0, tasksUsed: 0 },
            FR: { eventsUsed: 0, tasksUsed: 0 },
            DK: { eventsUsed: 0, tasksUsed: 0 },
            GB: { eventsUsed: 0, tasksUsed: 0 },
            IE: { eventsUsed: 0, tasksUsed: 0 },
            IS: { eventsUsed: 0, tasksUsed: 0 }
        }
    };
    let startTime = 0
    // Arrays to store all events and tasks
    let allEvents;
    let allTasks;
    const BACKEND_URL = "http://127.0.0.1:5000";  // URL for the Flask backend
    // fetching functions
    async function fetchAPIData(endpoint) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${endpoint}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    // Function to fetch all events and tasks once and store them
    async function initializeGameData() {
        const eventsData = await fetchAPIData(`${BACKEND_URL}/events`);
        const tasksData = await fetchAPIData(`${BACKEND_URL}/tasks`);
        allEvents = eventsData
        allTasks = tasksData
    }

    // Function to get a random event
    function getRandomEvent() {
        if (allEvents.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * allEvents.length);
        return allEvents[randomIndex];
    }

    // Function to get a random task
    function getRandomTask() {
        if (allTasks.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * allTasks.length);
        return allTasks[randomIndex];
    }
    // Start Game
    startBtn.addEventListener('click', async () => {
        try {
            startTime = Date.now();
            await initializeGameData();

            menuSection.style.display = 'none';
            nameEntrySection.style.display = 'block';
        } catch (error) {
            console.error('Error initializing game data:', error);
        }
    });
    submitNameBtn.addEventListener('click', () => {
        playerName = document.getElementById('playerName').value.trim();
        gameState.playerName = playerName
        if (playerName) {
            nameEntrySection.style.display = 'none';
            story.style.display = 'block';

        } else {
            alert('Please enter your name.');
        }
    });
    function updateCockpitUI() {
        const healthElement = document.getElementById('health');
        const antidotesElement = document.getElementById('antidotes');
        const visitedElement = document.getElementById('visited');

        // Update health
        if (healthElement) {
            healthElement.textContent = `Health: ${gameState.health}`;
        }

        // Update antidotes
        if (antidotesElement) {
            antidotesElement.textContent = `Antidotes: ${gameState.antidotes}/${gameState.totalAntidotesNeeded}`;
        }

        // Update visited countries
        if (visitedElement) {
            const visitedCountries = gameState.visitedCountries.length
                ? gameState.visitedCountries.join(', ')
                : 'None';
            visitedElement.textContent = `Visited Countries: ${visitedCountries}`;
        }
    }

    storybtn.addEventListener('click', () => {
        story.style.display = 'none';
        cockpitSection.style.display = 'block';
        document.body.style.backgroundImage = "url('./picsforpeli/cockpit_bg.png')";
        updateCockpitUI()
    });

    // Function to display the leaderboard
    function showLeaderboard(data) {
        const leaderboardSection = document.getElementById('leaderboard-section');
        const leaderboardBody = document.getElementById('leaderboard-body');
        menuSection.style.display = 'none';

        leaderboardBody.innerHTML = '';
        const leaderboardArray = Object.values(data);

        leaderboardArray.forEach(player => {
            player.forEach(player => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${player.player_id}</td>
                <td>${player.time}</td>
                <td>${player.healthbar_final}</td>
            `;
                leaderboardBody.appendChild(row);
            })
        });

        leaderboardSection.style.display = 'block';
    }

    // Fetch leaderboard data and display it
    document.getElementById('leaderboardBtn').addEventListener('click', async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/leaderboard');
            const data = await response.json();

            if (data.leaderboard) {
                showLeaderboard(data);
            } else {
                console.error('Error: Invalid leaderboard data', data);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    });

    // Close the leaderboard
    document.getElementById('closeLeaderboardBtn').addEventListener('click', () => {
        document.getElementById('leaderboard-section').style.display = 'none';
        menuSection.style.display = 'block';
        document.body.style.backgroundImage = "url('./picsforpeli/menu_bg.png')";
        location.reload()
    });

    // quit game 
    quitBtn.addEventListener('click', () => {
        const userConfirmed = confirm("Do you really want to quit the game?");

        if (userConfirmed) {
            cockpitSection.style.display = 'none';

            menuSection.style.display = 'none';
        }
    });

    // Open Map
    mapBtn.addEventListener('click', () => {
        cockpitSection.style.display = 'none';
        mapSection.style.display = 'block';
        document.body.style.backgroundImage = "url('./picsforpeli/map_bg.png')";
        populateCountryList();
    });

    // Back to Cockpit
    backToCockpitBtn.addEventListener('click', () => {

        mapSection.style.display = 'none';
        cockpitSection.style.display = 'block';
        const dotElements = document.querySelectorAll('.dot');
        dotElements.forEach(dot => {
            dot.style.display = 'none';
        });
        document.body.style.backgroundImage = "url('./picsforpeli/cockpit_bg.png')";
        updateCockpitUI();

    });

    // Back to Map
    backToMapBtn.addEventListener('click', () => {
        document.body.style.backgroundImage = "url('./picsforpeli/map_bg.png')";
        countryEventSection.style.display = 'none';
        mapSection.style.display = 'block';
        clearChoices();
        const continueBtn = document.getElementById('continueBtn');
        continueBtn.style.display = 'none';
        updateCockpitUI();
        populateCountryList();
    });

    // Function to populate the country grid dynamically
    async function populateCountryList() {
        const countryGrid = document.getElementById('country-grid');
        countryGrid.innerHTML = '';

        if (gameState.visitedCountries.length >= 20) {
            checkWinCondition();
            checkGameOver();
            return;
        }
        else {
            checkGameOver();
            checkHealthStatus();
        }
        // Loop through the countries in gameState
        gameState.countries.forEach(country => {
            const countryButton = document.createElement('div');
            countryButton.textContent = country;
            countryButton.className = 'country-btn';


            if (gameState.visitedCountries.includes(country)) {
                countryButton.classList.add('visited');
                countryButton.disabled = true;
                draw_country(country);
            } else {

                countryButton.addEventListener('click', () => {
                    openCountryEvent(country); // Your function to handle the event

                    // Hide all the dots on the map
                    const dotElements = document.querySelectorAll('.dot');
                    dotElements.forEach(dot => {
                        dot.style.display = 'none';
                    });
                });
            }


            countryGrid.appendChild(countryButton);
        });
    }

    function updateHealthBar() {
        // Check if the health-bar container exists
        let healthBarContainer = document.getElementById('health-bar');
        if (!healthBarContainer) {
            console.warn("Health bar container not found! Creating a new one.");

            // Create the health-bar container
            healthBarContainer = document.createElement('div');
            healthBarContainer.id = 'health-bar';
            healthBarContainer.style.width = '100%';
            healthBarContainer.style.backgroundColor = '#4caf50';
            healthBarContainer.style.borderRadius = '8px';
            healthBarContainer.style.height = '25px';
            healthBarContainer.style.boxShadow = 'inset 0 4px 6px rgba(0, 0, 0, 0.2)';
            healthBarContainer.style.marginTop = '10px';

            // Append the container to its parent
            const healthDisplay = document.getElementById('health-display');
            if (!healthDisplay) {
                console.error("Health display container not found! Cannot create health bar.");
                return;
            }
            healthDisplay.appendChild(healthBarContainer);
        }

        // Check if the health-progress bar exists
        let healthProgress = document.getElementById('health-progress');
        if (!healthProgress) {
            console.warn("Health progress bar element not found! Creating a new one.");

            // Create the health-progress element
            healthProgress = document.createElement('div');
            healthProgress.id = 'health-progress';
            healthProgress.style.backgroundColor = '#ff9800';
            healthProgress.style.height = '100%';
            healthProgress.style.borderRadius = '8px';
            healthProgress.style.width = '100%'; // Default full width
            healthProgress.style.transition = 'width 0.3s ease'; // Smooth transition

            // Append it to the health-bar container
            healthBarContainer.appendChild(healthProgress);
        }

        // Update the width based on the current health percentage
        gameState.health = Math.min(gameState.health, 10)
        const healthPercentage = (gameState.health / 10) * 100; // Assuming max health is 10
        healthProgress.style.width = `${healthPercentage}%`;
    }

    async function openCountryEvent(country) {
        document.body.style.backgroundImage = "url('./picsforpeli/airport_bg.png')";
        mapSection.style.display = 'none';
        countryEventSection.style.display = 'block';
        const antidoteCountElement = document.getElementById('antidote-count');
        antidoteCountElement.textContent = gameState.antidotes;

        eventTitle.textContent = `You have selected this country: ${country}`;
        eventDescription.textContent = 'You land the plane safely. Time to see what happens!';
        eventDescription.style.color = 'black';

        updateHealthBar();

        if (!gameState.visitedCountries.includes(country)) {
            gameState.visitedCountries.push(country);
        }

        // Ensure events and tasks are balanced
        const countryData = gameState.countryData[country] || { eventsUsed: 0, tasksUsed: 0 };

        const usePotionBtn = document.getElementById('usePotionBtn');
        const continueBtn = document.getElementById('continueBtn');

        usePotionBtn.style.display = 'inline-block';
        continueBtn.style.display = 'none';

        // Handle the next step (event or task)
        function handleNextStep() {
            const totalActions = countryData.eventsUsed + countryData.tasksUsed;

            if (totalActions >= 2) {
                eventDescription.textContent = 'Nothing happens this time. Rest up and prepare for the next destination!';
            } else {
                if (countryData.eventsUsed <= countryData.tasksUsed) {
                    const event = getRandomEvent();
                    if (Math.random() > 0.3) {
                        if (event) {
                            path = event.image
                            document.body.style.backgroundImage = `url(${path})`;
                            eventDescription.textContent = event.description;
                            handleEventOutcome(event);
                            countryData.eventsUsed += 1;
                            allEvents = allEvents.filter(e => e.event_id !== event.event_id);
                        } else {
                            eventDescription.textContent = 'No events available right now.Continue your journey!.however you will lose some HP due frustrating';
                            updateHealth(-1);
                            countryData.eventsUsed += 1;
                        }
                    } else {
                        eventDescription.textContent = 'No events available right now.Continue your journey!.however you will lose some HP due frustrating';
                        updateHealth(-1);
                        countryData.eventsUsed += 1;
                    }
                } else {
                    const task = getRandomTask();
                    if (Math.random() > 0.2) {
                        if (task) {
                            path = task.image
                            document.body.style.backgroundImage = `url(${path})`;
                            eventDescription.textContent = task.description;
                            handleTaskOutcome(task);
                            countryData.tasksUsed += 1;
                            allTasks = allTasks.filter(e => e.task_id !== task.task_id);
                        } else {
                            eventDescription.textContent = 'No tasks available right now. Continue your journey!';
                            // updateHealth(-1);
                            countryData.tasksUsed += 1;
                        }
                    } else {
                        eventDescription.textContent = 'No tasks available right now. Continue your journey!';
                        updateHealth(-1);
                        countryData.tasksUsed += 1;
                    }
                }
            }

            gameState.countryData[country] = countryData;

            // checkWinCondition();
            // checkGameOver();
            // checkHealthStatus();

            if (totalActions <= 1) {
                continueBtn.style.display = 'inline-block';
            }
        }

        // Attach events to the buttons
        continueBtn.addEventListener('click', () => {
            clearChoices();
            continueBtn.style.display = 'none';
            handleNextStep();
        });

        // Start with the initial action description
        eventDescription.textContent = 'You land the plane safely. Time to see what happens!';
        continueBtn.style.display = 'inline-block';
    }
    usePotionBtn.addEventListener('click', () => {
        if (gameState.antidotes > 0) {
            gameState.antidotes--;
            const antidoteCountElement = document.getElementById('antidote-count');
            antidoteCountElement.textContent = gameState.antidotes;
            if (gameState.health <= 10) {
                gameState.health = gameState.health + 2
            }
            updateHealthBar();
            updateHealthDisplay()
        } else {
            alert("You have no antidotes left!");
        }
    });

    // handel outcome of events
    function handleEventOutcome(event) {
        if (!event || !event.choices || Object.keys(event.choices).length === 0) return;

        clearChoices();

        let choicesArray = JSON.parse(event.choices);
        const options = JSON.parse(event.outcomes);

        const choiceContainer = document.getElementById('choice-container');

        choicesArray.forEach(choice => {
            const choiceButton = document.createElement('button');
            choiceButton.textContent = choice.text;
            choiceButton.className = 'choice-btn';
            choiceButton.addEventListener('click', () => {
                const outcomeText = options[choice.option] || 'Outcome not found';
                eventDescription.textContent = outcomeText;

                health_impact = JSON.parse(event.health_impact);
                const healthImpact = health_impact[choice.option] || 0;

                updateHealth(healthImpact);
                updateHealthDisplay()

                clearChoices();
            });
            choiceContainer.appendChild(choiceButton);
        });
    }
    // handel outcome of tasks
    function handleTaskOutcome(task) {
        if (!task || !task.choices || Object.keys(task.choices).length === 0) return;

        clearChoices();

        let choicesArray = JSON.parse(task.choices);
        const options = JSON.parse(task.outcomes);

        const choiceContainer = document.getElementById('choice-container');

        choicesArray.forEach(choice => {
            const choiceButton = document.createElement('button');
            choiceButton.textContent = choice.text;
            choiceButton.className = 'choice-btn';
            choiceButton.addEventListener('click', () => {
                const outcomeText = options[choice.option] || 'Outcome not found';
                eventDescription.textContent = outcomeText;

                if (outcomeText.includes("antidote")) {
                    if (outcomeText.includes("refuses to give you the antidote") || outcomeText.includes("You missed the antidote")) {
                        updateHealth(-1);
                        updateHealthDisplay()
                    }
                    else {
                        updateHealth(task.reward_health);
                        gameState.antidotes += 1
                        const antidoteCountElement = document.getElementById('antidote-count');
                        antidoteCountElement.textContent = gameState.antidotes;
                        updateHealthDisplay()
                    }
                } else {
                    updateHealth(-1);
                    updateHealthDisplay()
                }
                clearChoices();
            });
            choiceContainer.appendChild(choiceButton);
        });
    }
    // to clear buttons
    function clearChoices() {
        const choiceContainer = document.getElementById('choice-container');
        choiceContainer.innerHTML = '';
    }
    // check health 
    function checkHealthStatus() {
        if (gameState.health <= 0) {
            endGame();
        }
    }
    // Function to update the player's health
    function updateHealth(healthChange) {
        gameState.health += healthChange;
        gameState.health = Math.min(gameState.health, 10)

        if (gameState.health <= 0) {
            endGame();
        }

        updateHealthDisplay();
        updateHealthBar();
    }

    // Function to update the health display on the screen
    function updateHealthDisplay() {
        const healthDisplay = document.getElementById('health-label');

        if (healthDisplay) {
            healthDisplay.textContent = `Health: ${gameState.health}`;
        }
    }
    // Function to reset the game state
    function restartGame() {
        document.body.style.backgroundImage = "url('./picsforpeli/menu_bg.png')";
        gameState = {
            currentCountry: null,
            visitedCountries: [],
            health: 10,
            antidotes: 0,
            totalAntidotesNeeded: 9,
            countries: ["FI", "SE", "NO", "EE", "LV", "LT", "PL", "SK", "HU", "AT", "DE", "CH", "CZ", "BE", "NL", "FR", "DK", "GB", "IE", "IS"],
        };

        const gameOverScreen = document.querySelector('.game-over-screen');
        if (gameOverScreen) {
            gameOverScreen.remove();
        }

        mapSection.style.display = 'none';
        countryEventSection.style.display = 'none';
        cockpitSection.style.display = 'none';
        menuSection.style.display = 'block'
    }

    function checkGameOver() {
        if (gameState.health <= 0) {
            endGame();
        }
    }
    // end of the game and display it 
    function endGame() {
        document.body.style.backgroundImage = "url('./picsforpeli/lost_bg.png')";
        mapSection.style.display = 'none';
        countryEventSection.style.display = 'none';
        cockpitSection.style.display = 'none';

        const gameOverScreen = document.createElement('div');
        gameOverScreen.classList.add('game-over-screen');

        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart';
        restartButton.onclick = restartGame;

        gameOverScreen.appendChild(restartButton);

        document.body.appendChild(gameOverScreen);
    }
    // check if the player win 
    function checkWinCondition() {
        if (gameState.visitedCountries.length === 20 && gameState.health > 0) {
            displayWinningScreen();
        }
    }
    // display the winnig screen
    async function displayWinningScreen() {
        document.body.style.backgroundImage = "url('./picsforpeli/won_bg.png')";
        mapSection.style.display = 'none';
        countryEventSection.style.display = 'none';
        cockpitSection.style.display = 'none';
        const winningScreen = document.createElement('div');
        winningScreen.classList.add('winning-screen');
        winningScreen.innerHTML = `
            <button id="go-to-leaderboard-btn">Go to Leaderboard</button>
        `;

        document.body.appendChild(winningScreen);

        const leaderboardButton = document.getElementById('go-to-leaderboard-btn');

        leaderboardButton.addEventListener('click', async () => {
            await savePlayerDataToBackend();

            winningScreen.style.display = 'none';
            try {
                const response = await fetch('http://127.0.0.1:5000/leaderboard');
                const data = await response.json();

                if (data.leaderboard) {
                    showLeaderboard(data);
                } else {
                    console.error('Error: Invalid leaderboard data', data);
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        });
    }
    // save data of player to db
    function savePlayerDataToBackend() {
        const playerData = {
            name: gameState.playerName,
            health: gameState.health,
            time: Math.floor((Date.now() - startTime) / 1000)
        };

        return fetch(`${BACKEND_URL}/update_leaderboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Player data saved:', data);
            })
            .catch(error => {
                console.error('Error saving player data:', error);
            });
    }

    const countryCoordinates = {
        "FI": { x: 520, y: 100 }, // Finland
        "SE": { x: 460, y: 150 }, // Sweden
        "NO": { x: 400, y: 140 }, // Norway
        "EE": { x: 520, y: 200 }, // Estonia
        "LV": { x: 500, y: 230 }, // Latvia
        "LT": { x: 480, y: 260 }, // Lithuania
        "PL": { x: 460, y: 330 }, // Poland
        "SK": { x: 420, y: 370 }, // Slovakia
        "HU": { x: 440, y: 390 }, // Hungary
        "AT": { x: 400, y: 350 }, // Austria
        "DE": { x: 360, y: 300 }, // Germany
        "CH": { x: 320, y: 350 }, // Switzerland
        "CZ": { x: 390, y: 320 }, // Czechia
        "BE": { x: 300, y: 300 }, // Belgium
        "NL": { x: 280, y: 290 }, // Netherlands
        "FR": { x: 550, y: 750 }, // France
        "DK": { x: 360, y: 200 }, // Denmark
        "GB": { x: 200, y: 250 }, // Great Britain
        "IE": { x: 150, y: 250 }, // Ireland
        "IS": { x: 100, y: 100 }  // Iceland
    };
    // draw dot on the country has visted
    function draw_country(country) {
        const coords = countryCoordinates[country];

        if (coords) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.style.left = `${coords.x}px`;
            dot.style.top = `${coords.y}px`;
            document.body.appendChild(dot);
            console.log(`Dot placed for ${country} at (${coords.x}, ${coords.y})`);
        } else {
            console.error(`Coordinates for ${country} not found.`);
        }
    }
});

