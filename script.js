function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = []

  for(let i = 0; i < rows; i++) {
    board[i] = [];
    for(let j = 0; j  < columns; j++) {
      board[i].push(Cell())
    }
  }
  const getBoard = () => board;

  const markCell = (row, column, player) => {
    if(board[row][column].getValue !== 0) {
      return;
    };
    board[row][column].addToken(player);
  }

  const printBoard = () => { //only for console game (not needed after ui is built)
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  };

  return { getBoard, markCell, printBoard }
}

function Cell() {
  let value = 0;
  
  const addToken = (player) => {
    value = player
  };

  const getValue = () => value;

  return {
    addToken, 
    getValue
  };
}