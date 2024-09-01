// Gameboard and basic functions assumed to be defined elsewhere
// Heuristics-based Approach Implementation

function heuristicMove(board) {
  // Play center if available
  if (board[4] === "") return 4;

  // Play opposite side if opponent played a side
  let lastPlayerMove = findLastMove(board, 'O');
  if (lastPlayerMove !== -1 && board[8 - lastPlayerMove] === "") return 8 - lastPlayerMove;

  // Play a corner if center is taken
  const corners = [0, 2, 6, 8].filter(i => board[i] === "");
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

  // Play any empty cell if no strategic moves are available
  return randomEmptyCell(board);
}

function findLastMove(board, marker) {
  for (let i = board.length - 1; i >= 0; i--) {
      if (board[i] === marker) return i;
  }
  return -1;
}

function randomEmptyCell(board) {
  const emptyCells = board.reduce((acc, val, idx) => val === "" ? [...acc, idx] : acc, []);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Example AI Move Decision Incorporating Heuristics
function aiMove() {
  const board = Gameboard.getBoard();
  let move;

  // Use heuristic move strategy
  move = heuristicMove(board);

  // Set the move on the gameboard
  Gameboard.setCell(move, 'X');
}

// Example usage in game loop or event
function gameLoop() {
  if (Gameboard.isAITurn()) {
      aiMove();
  }
  // Other game logic like checking for a winner, switching turns, etc.
}

// Assume this is being called in response to the player's move
gameLoop();
