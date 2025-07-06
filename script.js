function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [] 
  //board is stored as an array with rows being the nested arrays. 
  // [[0, 0, 0], 
  //  [0, 0, 0], 
  //  [0, 0, 0]]

  for(let i = 0; i < rows; i++) {
    board[i] = [];
    for(let j = 0; j  < columns; j++) {
      board[i].push(Cell())
    }
  }
  const getBoard = () => board; // a stored function to get the board for the ui

  const markCell = (row, column, player) => { 
    if(board[row - 1][column - 1].getValue !== 0) { // takes the row and column of the cell and checks if it's already been marked
      return;
    };
    return board[row - 1][column - 1].addToken(player); //mark the cell with the player token
  }

  const printBoard = () => { //only for console game (not needed after ui is built)
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue())) //map through every cell in every row to console.log
    console.log(boardWithCellValues);
  };

  return { getBoard, markCell, printBoard } //object to represent the state of the board and a markCell method to mark the Cell with player tokens
}

function Cell() { 
  let value = 0; //initial cell value in a fresh board is 0
  
  const addToken = (player) => { //a private function for cells in the board to change the cell value to the player Token values (player one = 1, player two = 2)
    value = player
  };

  const getValue = () => value; //retrieve the current value of the cell

  return { addToken, getValue }; //object to control individual cells (factory function)
}

function GameController(playerOneName = 'Player One', playerTwoName = 'Player Two') { //object to control the flow of the game (factory function)
  const board = Gameboard();

  const players = [{name: playerOneName, token: 1}, {name: playerTwoName, token: 2}]; //an array with two object for the two players

  let activePlayer = players[0]; //first player is player one in index 0

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]; //if activeplayer is player one change to player 2 otherwise chagne to player one
  };
  const getActivePlayer = () => activePlayer; //retrieve current activePlayer object

  const printNewRound = () => { //console log current board condition and new player's turn
    board.printBoard();
    console.log(`${getActivePlayer}'s turn`);
  }

  const playRound = (row, column) => {
    console.log(`Dropping ${getActivePlayer}'s token into row ${row} and column ${column}`) //for console game
    board.markCell(row, column, getActivePlayer().token); //mark the cell at row and column with activeplayer's token
    switchPlayerTurn();
    printNewRound();
  };
  
  printNewRound(); //start of game message for fresh board

  return { playRound, getActivePlayer } //object to play out rounds of tic tac toe with getActivePlayer object for ui
}

const game = GameController();