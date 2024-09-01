const readline = require('readline');

const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  const setCell = (index, marker) => {
    if (index >= 0 && index < board.length && board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

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

  const isTie = () => {
    return !board.includes("");
  };

  return { getBoard, resetBoard, setCell, isWinner, isTie };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const GameController = (() => {
  const player1 = Player("Player 1", "O");
  const computer = Player("Computer", "X");

  const getHeuristicMove = (board) => {
    // 1. If center is available, take it
    if (board[4] === "") return 4;

    // 2. Check for any immediate wins for the computer
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = 'X';
        if (Gameboard.isWinner('X')) {
          board[i] = "";
          return i;
        }
        board[i] = ""; // Reset the cell
      }
    }

    // 3. Check for any blocking moves
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = 'O';
        if (Gameboard.isWinner('O')) {
          board[i] = "";
          return i;
        }
        board[i] = ""; // Reset the cell
      }
    }

    // 4. Play opposite side if player played a side
    const lastPlayerMove = findLastMove(board, 'O');
    if (lastPlayerMove !== -1 && board[8 - lastPlayerMove] === "") return 8 - lastPlayerMove;

    // 5. Play a corner if available
    const corners = [0, 2, 6, 8].filter(i => board[i] === "");
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

    // 6. Play any available cell
    return randomEmptyCell(board);
  };

  const findLastMove = (board, marker) => {
    for (let i = board.length - 1; i >= 0; i--) {
      if (board[i] === marker) return i;
    }
    return -1;
  };

  const randomEmptyCell = (board) => {
    const emptyCells = board.reduce((acc, val, idx) => val === "" ? [...acc, idx] : acc, []);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  const playGame = async () => {
    Gameboard.resetBoard();
    let currentPlayer = player1;

    while (true) {
      console.log(Gameboard.getBoard());
      let index;
      if (currentPlayer === player1) {
        const input = await getInput(`Enter a move for ${currentPlayer.name} (0-8), or 'q' to quit: `);
        if (input === 'q') {
          console.log("Game Over! You quit the game.");
          break;
        }
        index = parseInt(input, 10);
      } else {
        index = getHeuristicMove(Gameboard.getBoard());
        console.log(`Computer chose position: ${index}`);
      }

      if (Gameboard.setCell(index, currentPlayer.marker)) {
        if (Gameboard.isWinner(currentPlayer.marker)) {
          console.log(Gameboard.getBoard());
          console.log(`Game Over! ${currentPlayer.name} wins!`);
          break;
        } else if (Gameboard.isTie()) {
          console.log(Gameboard.getBoard());
          console.log("Game Over! It's a tie!");
          break;
        }

        currentPlayer = currentPlayer === player1 ? computer : player1;
      } else {
        console.log("Invalid move. Try again.");
      }
    }
  };

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
          rl.close();
          resolve(getInput(prompt));
        }
      });
    });
  };

  const startGame = async () => {
    while (true) {
      console.log("Welcome to Tic Tac Toe!");
      console.log("1. Play against the computer");
      console.log("2. Quit");

      const choice = await getInput("Enter your choice: ");
      if (choice === '1') {
        await playGame();
      } else if (choice === '2') {
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

GameController.startGame();
