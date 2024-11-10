let divBoard = document.getElementById('divBoard');
let resetBtn = document.getElementById('resetBtn');
let counter1 = document.getElementById('counter1');  
let counter2 = document.getElementById('counter2');  
let matchCounter1 = document.getElementById('matchCounter1');  
let matchCounter2 = document.getElementById('matchCounter2');  
let timer = document.getElementById('timer');
let winner = document.getElementById('winner');
let startTime;
let timerInterval;

resetBtn.onclick = game;  

game();

function game() {
    const numbers = [1, 10, 20, 30, 40, 51, 60, 70, 80, 90, 99, 55, 45, 65, 35, 49];
    const cardsList = [];
    const imgList = [];
    const maxClickedSet = 2; 
    let clickedCount = 0;
    let matches = 0;
    let player1Matches = 0;  
    let player2Matches = 0;  
    let player1Moves = 0;  
    let player2Moves = 0;  
    let firstCardIndex, secondCardIndex;
    let firstCardValue, secondCardValue;
    let beenFlipped = false;
    let currentPlayer = 1;  

    stopTimer();
    startTime = null; 
    divBoard.innerHTML = ""; 
    counter1.innerHTML = "Player 1 moves: 0"; 
    counter2.innerHTML = "Player 2 moves: 0";  
    matchCounter1.innerHTML = "Player 1 matches: 0";  
    matchCounter2.innerHTML = "Player 2 matches: 0"; 
    timer.innerHTML = "00:00:00";  
    winner.innerHTML = "";  

    for (let i = 0; i < 16; i++) {
        cardsList.push(document.createElement('div'));
        cardsList[i].className = 'cell';
        divBoard.appendChild(cardsList[i]);
        const randomIndex = Math.floor(Math.random() * numbers.length);
        const card = numbers[randomIndex];
        numbers.splice(randomIndex, 1);
        imgList.push(document.createElement('img'));
        imgList[i].src = "images/num-" + card + ".jpg";

        cardsList[i].onclick = (ev) => {
            if (clickedCount == maxClickedSet) {
                return; 
            }
            if (!beenFlipped) {
                beenFlipped = true;
                firstCardIndex = i;
                cardsList[i].appendChild(imgList[i]);
                firstCardValue = parseInt(card);
                clickedCount++;
            } else if (i !== firstCardIndex) {
                beenFlipped = false;
                secondCardIndex = i;
                cardsList[i].appendChild(imgList[i]);
                secondCardValue = parseInt(card);
                clickedCount++;
            }
            if (firstCardValue && secondCardValue && (firstCardValue + secondCardValue != 100)) {
                setTimeout(() => {
                    cardsList[firstCardIndex].removeChild(imgList[firstCardIndex]);
                    cardsList[secondCardIndex].removeChild(imgList[secondCardIndex]);
                    firstCardValue = null;
                    secondCardValue = null;
                    clickedCount = 0;
                }, 850);
            }
            if (firstCardValue + secondCardValue == 100) {
                imgList[firstCardIndex].style.visibility = 'visible';
                imgList[secondCardIndex].style.visibility = 'visible';
                cardsList[firstCardIndex] = null;
                cardsList[secondCardIndex] = null;
                firstCardValue = null;
                secondCardValue = null;
                clickedCount = 0;
                matches++;
                if (currentPlayer === 1) {
                    player1Matches++;
                    matchCounter1.innerHTML = "Player 1 matches: " + player1Matches;
                } else {
                    player2Matches++;
                    matchCounter2.innerHTML = "Player 2 matches: " + player2Matches;
                }
            }
            if (matches == 8) {
                winner.innerHTML = player1Matches > player2Matches ? "Player 1 Wins!" : (player1Matches < player2Matches ? "Player 2 Wins!" : "It's a Tie!");
                stopTimer();  
                const elapsedTime = Date.now() - startTime;
                const formattedTime = formatTime(elapsedTime);
                saveScore('Player 1', formattedTime, player1Moves); 
            }
            if (clickedCount == maxClickedSet) {
                if (currentPlayer === 1) {
                    player1Moves++;
                    counter1.innerHTML = "Player 1 moves: " + player1Moves;
                } else {
                    player2Moves++;
                    counter2.innerHTML = "Player 2 moves: " + player2Moves;
                }
                currentPlayer = currentPlayer === 1 ? 2 : 1;
            }
            if (player1Moves + player2Moves === 1 && !startTime) {
                startTimer();
            }
        };
    }
};

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
};

function stopTimer() {
    clearInterval(timerInterval);
};

function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const formattedTime = formatTime(elapsedTime);
    timer.innerHTML = formattedTime;
};

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );
}

function saveScore(name, time, moves) {
    fetch('http://localhost:3000/api/save-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, time, moves })
    })
    .then(response => response.json())
    .then(data => console.log(data.message))
    .catch(error => console.error('Error saving score:', error));
};