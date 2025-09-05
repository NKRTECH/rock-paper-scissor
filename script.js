// Sound configuration
const SOUND_CONFIG = {
    click: 'assets/sounds/click.mp3',
    win: 'assets/sounds/win.mp3',
    lose: 'assets/sounds/lose.mp3',
    draw: 'assets/sounds/draw.mp3',
    gameOver: 'assets/sounds/game-over.mp3'
};

// Game state
const gameState = {
    playerScore: 0,
    computerScore: 0,
    round: 0,
    maxRounds: 5,
    gameOver: false,
    isAudioEnabled: true
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
const loader = document.getElementById('loader');

// Emoji mapping for choices
const emojis = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️',
    unknown: '❔'
};

// Sound functions
function playSound(soundName) {
    if (!gameState.isAudioEnabled) return;
    
    const sound = gameState.sounds[soundName];
    if (sound) {
        const soundClone = sound.cloneNode();
        soundClone.volume = 0.5;
        soundClone.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Toggle sound on/off
function toggleSound() {
    gameState.isAudioEnabled = !gameState.isAudioEnabled;
    return gameState.isAudioEnabled;
}

// Game initialization
function initGame() {
    // Hide loader after a short delay to ensure everything is loaded
    setTimeout(() => {
        loader.classList.add('hidden');
        
        // Add click sound to all buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => playSound('click'));
        });
        
        // Add keyboard navigation for accessibility
        document.addEventListener('keydown', handleKeyPress);
        
        // Initialize game state
        resetGame();
    }, 1000);
}

// Keyboard navigation
function handleKeyPress(e) {
    if (gameState.gameOver && e.key === 'r') {
        resetGame();
        return;
    }
    
    if (e.key >= '1' && e.key <= '3') {
        const index = parseInt(e.key) - 1;
        const buttons = Array.from(choiceButtons);
        if (buttons[index]) {
            buttons[index].click();
        }
    } else if (e.key.toLowerCase() === 'm') {
        const isEnabled = toggleSound();
        showNotification(`Sound ${isEnabled ? 'enabled' : 'disabled'}`);
    }
}

// Show temporary notification
function showNotification(message, duration = 2000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

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
        playSound('win');
        playerScoreEl.classList.add('score-update');
        setTimeout(() => playerScoreEl.classList.remove('score-update'), 300);
    } else if (winner === 'computer') {
        gameState.computerScore++;
        computerScoreEl.textContent = gameState.computerScore;
        playSound('lose');
        computerScoreEl.classList.add('score-update');
        setTimeout(() => computerScoreEl.classList.remove('score-update'), 300);
    } else {
        playSound('draw');
    }
    
    gameState.round++;
    roundEl.textContent = gameState.round;
    roundEl.classList.add('pulse');
    setTimeout(() => roundEl.classList.remove('pulse'), 300);
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
    
    // Clear previous classes
    resultMessageEl.className = '';
    
    if (winner === 'tie') {
        message = `It's a tie! Both chose ${playerChoice}.`;
        resultMessageEl.classList.add('tie');
        playSound('draw');
    } else if (winner === 'player') {
        message = `You win! ${playerChoice} beats ${computerChoice}.`;
        resultMessageEl.classList.add('win');
        playSound('win');
    } else {
        message = `You lose! ${computerChoice} beats ${playerChoice}.`;
        resultMessageEl.classList.add('lose');
        playSound('lose');
    }
    
    // Add shake animation to the result message
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
            resultMessageEl.className = 'win';
            playSound('win');
        } else if (gameState.computerScore > gameState.playerScore) {
            finalMessage = '😢 Game Over! Computer Wins The Game!';
            resultMessageEl.className = 'lose';
            playSound('lose');
        } else {
            finalMessage = '🤝 It\'s a Tie Game! Try Again!';
            resultMessageEl.className = 'tie';
            playSound('draw');
        }
        
        // Play game over sound
        playSound('gameOver');
        
        // Add celebration effect
        if (gameState.playerScore > gameState.computerScore) {
            addConfetti();
        }
        
        resultMessageEl.textContent = finalMessage;
        resetBtn.style.display = 'block';
        
        // Disable choice buttons with animation
        choiceButtons.forEach((button, index) => {
            setTimeout(() => {
                button.style.transform = 'scale(0.9)';
                button.style.opacity = '0.6';
                button.style.cursor = 'not-allowed';
                button.disabled = true;
            }, index * 100);
        });
        
        // Show keyboard hint
        showNotification('Press R to play again', 3000);
        
        return true;
    }
    return false;
}

// Confetti effect for winning
function addConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = (Math.random() * 2) + 's';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confettiContainer.appendChild(confetti);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
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

// Add confetti styles
const confettiStyles = document.createElement('style');
confettiStyles.textContent = `
    .confetti-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
        overflow: hidden;
    }
    
    .confetti {
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: #f00;
        opacity: 0.8;
        animation: fall linear forwards;
    }
    
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        font-size: 0.9rem;
        z-index: 1001;
        transition: transform 0.3s ease, opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
    }
    
    .notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    
    .score-update {
        animation: pulse 0.5s ease;
        color: #4CAF50 !important;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(confettiStyles);

// Sound functions
function playSound(soundName) {
    if (!gameState.isAudioEnabled) return;
    
    const audio = new Audio(SOUND_CONFIG[soundName]);
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio play failed:', e));
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);
