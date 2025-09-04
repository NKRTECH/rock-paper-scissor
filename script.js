// Game state
const gameState = {
    playerScore: 0,
    computerScore: 0,
    round: 0,
    maxRounds: 5,
    gameOver: false
};

// DOM Elements
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const roundEl = document.getElementById('round');
const resultMessageEl = document.getElementById('result-message');
const playerMoveEl = document.getElementById('player-move');
const computerMoveEl = document.getElementById('computer-move');
const choiceButtons = document.querySelectorAll('.choice');
const resetBtn = document.getElementById('reset-btn');

// Emoji mapping for choices
const emojis = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️',
    unknown: '❔'
};

// Game logic
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return 'tie';
    
    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };
    
    return winConditions[playerChoice] === computerChoice ? 'player' : 'computer';
}

function updateScore(winner) {
    if (winner === 'player') {
        gameState.playerScore++;
        playerScoreEl.textContent = gameState.playerScore;
    } else if (winner === 'computer') {
        gameState.computerScore++;
        computerScoreEl.textContent = gameState.computerScore;
    }
    
    gameState.round++;
    roundEl.textContent = gameState.round;
}

function updateMoves(playerChoice, computerChoice) {
    // Reset and add animation
    playerMoveEl.textContent = emojis[playerChoice];
    computerMoveEl.textContent = emojis[computerChoice];
    
    // Add bounce animation
    playerMoveEl.classList.add('bounce');
    computerMoveEl.classList.add('bounce');
    
    // Remove animation after it completes
    setTimeout(() => {
        playerMoveEl.classList.remove('bounce');
        computerMoveEl.classList.remove('bounce');
    }, 500);
}

function showResult(winner, playerChoice, computerChoice) {
    let message = '';
    
    if (winner === 'tie') {
        message = `It's a tie! Both chose ${playerChoice}.`;
    } else if (winner === 'player') {
        message = `You win! ${playerChoice} beats ${computerChoice}.`;
    } else {
        message = `You lose! ${computerChoice} beats ${playerChoice}.`;
    }
    
    resultMessageEl.textContent = message;
    resultMessageEl.classList.add('fade-in');
    
    // Remove animation class after it completes
    setTimeout(() => {
        resultMessageEl.classList.remove('fade-in');
    }, 500);
}

function checkGameOver() {
    if (gameState.round >= gameState.maxRounds) {
        gameState.gameOver = true;
        
        let finalMessage = '';
        if (gameState.playerScore > gameState.computerScore) {
            finalMessage = '🎉 Congratulations! You Won The Game! 🎉';
        } else if (gameState.computerScore > gameState.playerScore) {
            finalMessage = '😢 Game Over! Computer Wins The Game!';
        } else {
            finalMessage = '🤝 It\'s a Tie Game! Try Again!';
        }
        
        resultMessageEl.textContent = finalMessage;
        resetBtn.style.display = 'block';
        
        // Disable choice buttons
        choiceButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
        });
        
        return true;
    }
    return false;
}

function resetGame() {
    // Reset game state
    gameState.playerScore = 0;
    gameState.computerScore = 0;
    gameState.round = 0;
    gameState.gameOver = false;
    
    // Reset UI
    playerScoreEl.textContent = '0';
    computerScoreEl.textContent = '0';
    roundEl.textContent = '0';
    resultMessageEl.textContent = 'Choose your move to start the game!';
    playerMoveEl.textContent = emojis.unknown;
    computerMoveEl.textContent = emojis.unknown;
    resetBtn.style.display = 'none';
    
    // Re-enable choice buttons
    choiceButtons.forEach(button => {
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    });
}

// Event Listeners
choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (gameState.gameOver) return;
        
        const playerChoice = button.dataset.choice;
        const computerChoice = getComputerChoice();
        const winner = determineWinner(playerChoice, computerChoice);
        
        updateMoves(playerChoice, computerChoice);
        updateScore(winner);
        showResult(winner, playerChoice, computerChoice);
        checkGameOver();
    });
});

resetBtn.addEventListener('click', resetGame);

// Initialize game
resetGame();
