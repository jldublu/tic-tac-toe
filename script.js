let gameboard = (() => {
  let gameboard = [];
  let createBoard = () => {
    const gameboardDiv = document.querySelector('.gameboard');
    for (let i = 0; i < 9; i++) {
      const boardSquare = document.createElement('div');
      boardSquare.classList.add('board-square');
      boardSquare.setAttribute('data-index', i);
      if (gameboard[i]) {
        boardSquare.textContent = gameboard[i];
      } 

      gameboardDiv.appendChild(boardSquare);
    }
  }

  let updateboardSquare = (index, marker) => {
    const boardSquare = document.querySelector(`div[data-index='${index}']`);
    boardSquare.textContent = marker;
  }

  return {gameboard, createBoard, updateboardSquare};
})();

gameboard.createBoard();
gameboard.updateboardSquare(0, 'X'); 
gameboard.updateboardSquare(1, 'O');
