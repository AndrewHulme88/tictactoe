const readline = require('readline');

// Define the Gameboard module
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;
    const setCell = (index, marker) => {
        if (index >= 0 && index < 9 && board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };
    const isWinner = (marker) => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        return winPatterns.some(pattern => pattern.every(index => board[index] === marker));
    };
    const isTie = () => board.every(cell => cell !== "");
    return { getBoard, setCell, isWinner, isTie };
})();

// Get user input with validation
const getInput = (prompt) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(prompt, (answer) => {
            const move = answer.trim();
            if (move === 'q' || (parseInt(move, 10) >= 0 && parseInt(move, 10) <= 8)) {
                rl.close();
                resolve(move);
            } else {
                console.log('Invalid input. Please enter a number from 0 to 8 or "q" to quit.');
                resolve(getInput(prompt)); // Recursively call to get valid input
            }
        });
    });
};

// Get a valid move
const getValidMove = async (currentPlayer) => {
    let index;
    while (true) {
        index = await getInput(`Enter a move for ${currentPlayer.name} (0-8), or 'q' to quit: `);
        if (index === 'q') return index;
        if (!isNaN(index) && index >= 0 && index < 9 && Gameboard.setCell(index, currentPlayer.marker)) {
            return parseInt(index, 10);
        }
        console.log("Invalid move. Please enter a number between 0 and 8 for an empty cell.");
    }
};

// Get a random empty cell for AI
const getRandomEmptyCell = () => {
    const emptyCells = Gameboard.getBoard().map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

// Get AI move with a simple strategy
const getAIMove = () => {
    const emptyCells = Gameboard.getBoard().reduce((acc, val, idx) => val === "" ? [...acc, idx] : acc, []);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

// Play the game
const playGame = async (mode) => {
    let currentPlayer = { name: 'Player 1', marker: 'X' };
    while (true) {
        displayBoard(Gameboard.getBoard());
        if (mode === "single" && currentPlayer.marker === 'O') {
            const move = getAIMove();
            Gameboard.setCell(move, currentPlayer.marker);
            if (Gameboard.isWinner(currentPlayer.marker)) {
                displayBoard(Gameboard.getBoard());
                console.log(`Game Over! ${currentPlayer.name} wins!`);
                break;
            }
            if (Gameboard.isTie()) {
                displayBoard(Gameboard.getBoard());
                console.log("Game Over! It's a tie!");
                break;
            }
            currentPlayer = { name: 'Player 1', marker: 'X' };
        } else {
            const move = await getValidMove(currentPlayer);
            if (move === 'q') {
                console.log("Game quit.");
                break;
            }
            Gameboard.setCell(move, currentPlayer.marker);
            if (Gameboard.isWinner(currentPlayer.marker)) {
                displayBoard(Gameboard.getBoard());
                console.log(`Game Over! ${currentPlayer.name} wins!`);
                break;
            }
            if (Gameboard.isTie()) {
                displayBoard(Gameboard.getBoard());
                console.log("Game Over! It's a tie!");
                break;
            }
            currentPlayer = { name: currentPlayer.name === 'Player 1' ? 'Player 2' : 'Player 1', marker: currentPlayer.marker === 'X' ? 'O' : 'X' };
        }
    }
};

// Display the board graphically
const displayBoard = (board) => {
    console.log('\n' +
        ' ' + board[0] + ' | ' + board[1] + ' | ' + board[2] + '\n' +
        '---+---+---\n' +
        ' ' + board[3] + ' | ' + board[4] + ' | ' + board[5] + '\n' +
        '---+---+---\n' +
        ' ' + board[6] + ' | ' + board[7] + ' | ' + board[8] + '\n');
};

// Start the game
const startGame = async () => {
    while (true) {
        console.log("Welcome to Tic Tac Toe!");
        console.log("1. Single Player");
        console.log("2. Multiplayer");
        console.log("3. Quit");

        const choice = await getInput("Enter your choice (1, 2, or 3): ");
        if (['1', '2', '3'].includes(choice)) {
            if (choice === '1') {
                await playGame("single");
            } else if (choice === '2') {
                await playGame("multi");
            } else if (choice === '3') {
                console.log("Goodbye!");
                break;
            }
        } else {
            console.log('Invalid choice. Please choose 1, 2, or 3.');
        }
    }
};

startGame();
