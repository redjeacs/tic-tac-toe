function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];
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
    if(board[row][column].getValue() !== 0) {
      throw new Error('Cell already occupied');
    }
    board[row][column].addToken(player); //mark the cell with the player token
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
    value = player;
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
    console.log(`${getActivePlayer().name}'s turn`);
  }

  const checkWin = (board) => { 
    const player = getActivePlayer().name;
    const playerValue = getActivePlayer().token;
    for(let i = 0; i < 3; i++) { //iterate through 3 rows
      if(
      board[i][0].getValue() === playerValue && //the board array's row i cell 0 value must match current player token
      board[i][1].getValue() === playerValue && // cell 1 value
      board[i][2].getValue() === playerValue // cell 2 value (all must be equal to current player)
      ) {
        console.log(`${player} wins!`); //announce winner in console
        return player;
      }
    }
    for(let j = 0; j < 3; j++) { //iterate through 3 columns
      if(
        board[0][j].getValue() === playerValue && // row 0 column j
        board[1][j].getValue() === playerValue && // row 1 column j
        board[2][j].getValue() === playerValue // row 2 column j (must all match current player token)
      ) {
        console.log(`${player} wins!`); //announce winner in console
        return player;
      }
    }
    if( //first diagonal check
    board[0][0].getValue() === playerValue && // top left corner cell
    board[1][1].getValue() === playerValue && // middle cell
    board[2][2].getValue() === playerValue // bottom right corner cell (must all match current player token)
    ) {
      console.log(`${player} wins!`); //announce winner in console
      return player;
    }
    if( //second diagonal check
    board[0][2].getValue() === playerValue && //top right corner cell
    board[1][1].getValue() === playerValue && //middle cell
    board[2][0].getValue() === playerValue //bottom left corner cell
    ) {
      console.log(`${player} wins!`); //announce winner in console
      return player;
    }
    let fullBoard = true; //set fullBoard true and check for 0 in board
    for(let i = 0; i < 3; i++) { // for row
      for(let j = 0; j < 3; j++) {// for column 
        if(board[i][j].getValue() === 0) { //if current cell is 0
          fullBoard = false; // board is not full yet
          break; //end the function early
        }
      }
      if(!fullBoard) break;
    }
    if(fullBoard) { //if every cell has a player token (!0)
        console.log('Tie'); //announce tie in console
        return 'Tie';
      }
    return null; //no winner yet
  }

  const playRound = (row, column) => {
    console.log(`Dropping ${getActivePlayer().name}'s token into row ${row} and column ${column}`) //for console game
    board.markCell(row, column, getActivePlayer().token); //mark the cell at row and column with activeplayer's token
    if(checkWin(board.getBoard()) === getActivePlayer().name || checkWin(board.getBoard()) === 'Tie') {
      printNewRound();
      return;
    }
    switchPlayerTurn();
    printNewRound();
  };
  
  printNewRound(); //start of game message for fresh board

  return { playRound, getActivePlayer, getBoard: board.getBoard, checkWin }; //object to play out rounds of tic tac toe with getActivePlayer object for ui
}

function ScreenController() {
  const game = GameController(); //call the GameController module
  const playerTurnDiv = document.querySelector('.turn'); //call html h1 and stored in variable
  const boardDiv = document.querySelector('.board'); //call div for storing board
  const updateScreen = () => {
    boardDiv.textContent = ''; //clear board

    const board = game.getBoard(); //get board state and store in board
    const activePlayer = game.getActivePlayer().name; //get current active player

    playerTurnDiv.textContent = `${activePlayer}'s Turn`; //announce player turn in h1

    board.forEach((row) => { //for each row in board
      row.forEach((cell, index) => { // for each cell in row
        const cellButton = document.createElement('button'); // add a cellButton
        cellButton.classList.add('cell'); //add a class of cell to the buttons
        cellButton.dataset.column = index; //create a data-column attribute to identify column
        cellButton.dataset.row = board.indexOf(row);
        if(cell.getValue() === 1) {
          cellButton.textContent = 'O';
        }
        else if(cell.getValue() === 2) {
          cellButton.textContent = 'X';
        }
        else {
          cellButton.textContent = '';
        }
        boardDiv.appendChild(cellButton);
      });
    });
  };
  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    if(!selectedColumn || !selectedRow) {
      return; //check if i click a cell not the gaps in between
    }
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  };
  boardDiv.addEventListener('click', clickHandlerBoard);
  updateScreen(); //initial board render
} //no return needed for this module (everything is in here already)

const restartBtn = document.querySelector('.restart-game');
restartBtn.addEventListener('click', () => ScreenController());
ScreenController();