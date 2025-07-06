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

  const playerMove = (row, column, player) {
    const availableCells = board.filter((row) => row[column].getValue() === 0);
  }

  return { gameboard, players, }
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