// Import the readline module
const readline = require('readline');

// Create a Gameboard object
const Gameboard = (() => {
  // Initialize the game board with empty cells
  let board = ["", "", "", "", "", "", "", "", ""];

  // Function to get the current state of the game board
  const getBoard = () => board;

  // Function to reset the game board
  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  // Function to set a cell on the game board
  const setCell = (index, marker) => {
    if (index >= 0 && index < board.length && board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  // Function to check if a player has won the game
  const isWinner = (marker) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const combination = winningCombinations[i];
      if (
        board[combination[0]] === marker &&
        board[combination[1]] === marker &&
        board[combination[2]] === marker
      ) {
        return true;
      }
    }
    return false;
  };

  // Function to check if the game is a tie
  const isTie = () => {
    return !board.includes("");
  };

  return { getBoard, resetBoard, setCell, isWinner, isTie };
})();

// Create a Player object
const Player = (name, marker) => {
  return { name, marker };
};

// Create a GameController object
const GameController = (() => {
  // Create player objects
  const player1 = Player("Player 1", "O");
  const player2 = Player("Player 2", "X");
  const computer = Player("Computer", "X");

  // Function to play a game
  const playGame = async (gameMode) => {
    Gameboard.resetBoard();
    let currentPlayer = player1;
    let opponent = gameMode === "single" ? computer : player2;

    while (true) {
      console.log(Gameboard.getBoard());
      let index;
      if (currentPlayer === player1) {
        index = await getInput(`Enter a move for ${currentPlayer.name} (0-8), or 'q' to quit: `);
        if (index === 'q') {
          console.log("Game Over! You quit the game.");
          break;
        }
      } else if (currentPlayer === computer) {
        index = getAIMove();
      } else {
        index = await getInput(`Enter a move for ${currentPlayer.name} (0-8), or 'q' to quit: `);
        if (index === 'q') {
          console.log("Game Over! You quit the game.");
          break;
        }
      }

      if (Gameboard.setCell(index, currentPlayer.marker)) {
        if (Gameboard.isWinner(currentPlayer.marker)) {
          console.log(`Game Over! ${currentPlayer.name} wins!`);
          break;
        } else if (Gameboard.isTie()) {
          console.log("Game Over! It's a tie!");
          break;
        }

        currentPlayer = currentPlayer === player1 ? opponent : player1;
      } else {
        console.log("Invalid move. Try again.");
      }
    }
  };

  // Function to get a move from the AI
  const getAIMove = () => {
    // Simple AI: just pick a random empty cell
    const emptyCells = [];
    for (let i = 0; i < Gameboard.getBoard().length; i++) {
      if (Gameboard.getBoard()[i] === "") {
        emptyCells.push(i);
      }
    }
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  // Function to get input from the user
  const getInput = (prompt) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise(resolve => {
      rl.question(prompt, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  };

  // Function to start the game
  const startGame = async () => {
    while (true) {
      console.log("Welcome to Tic Tac Toe!");
      console.log("1. Play single player game against the computer");
      console.log("2. Play two player game");
      console.log("3. Quit");

      const choice = await getInput("Enter your choice: ");
      if (choice === '1') {
        await playGame("single");
      } else if (choice === '2') {
        await playGame("multi");
      } else if (choice === '3') {
        console.log("Goodbye!");
        break;
      } else {
        console.log("Invalid choice. Please try again.");
      }

      const playAgain = await getInput("Do you want to play again? (y/n): ");
      if (playAgain.toLowerCase() !== 'y') {
        console.log("Goodbye!");
        break;
      }
    }
  };

  return { startGame };
})();

// Start the game
GameController.startGame();
