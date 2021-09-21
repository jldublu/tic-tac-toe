'use strict';

let gameboard = (() => {
  let gameboard = ['', '', '', '', '', '', '', '', ''];
  const gameboardDiv = document.querySelector('.gameboard');
  const createBoard = () => {
    for (let i = 0; i < 9; i++) {
      const boardSquare = document.createElement('div');
      boardSquare.classList.add('board-square');
      boardSquare.setAttribute('data-index', i);
      gameboardDiv.appendChild(boardSquare);
    }
  };

  const updateBoardSquare = (index, marker) => {
    const boardSquare = document.querySelector(`div[data-index='${index}']`);
    boardSquare.textContent = marker;
    gameboard.splice(index, 1, marker);
  };

  const isBoardSquareEmpty = (index) => {
    const boardSquare = document.querySelector(`div[data-index='${index}']`);
    return boardSquare.textContent === '';
  }

  const isThreeInARow = (marker) => {
    const topRow = gameboard[0] == marker && gameboard[1] == marker && gameboard[2] == marker;
    const middleRow = gameboard[3] == marker && gameboard[4] == marker && gameboard[5] == marker;
    const bottomRow = gameboard[6] == marker && gameboard[7] == marker && gameboard[8] == marker;

    const leftColumn = gameboard[0] == marker && gameboard[3] == marker && gameboard[6] == marker;
    const middleColumn = gameboard[1] == marker && gameboard[4] == marker && gameboard[7] == marker;
    const rightColumn = gameboard[2] == marker && gameboard[5] == marker && gameboard[8] == marker;

    const diagonal1 = gameboard[0] == marker && gameboard[4] == marker && gameboard[8] == marker;
    const diagonal2 = gameboard[2] == marker && gameboard[4] == marker && gameboard[6] == marker;
    return topRow || middleRow || bottomRow || leftColumn || middleColumn || rightColumn || diagonal1 || diagonal2;
  }

  return {gameboardDiv, createBoard, isBoardSquareEmpty, isThreeInARow, updateBoardSquare};
})();

let game = (() => {
  const playGame = () => {
    gameboard.createBoard();
    const player1 = playerFactory('player1', 'X', true);
    const player2 = playerFactory('player2', 'O', false);

    gameboard.gameboardDiv.addEventListener('click', (event) => {
      let element = event.target;
      if (element.hasAttribute('data-index')) {
        const index = element.getAttribute('data-index');
        if (gameboard.isBoardSquareEmpty(index)) {
          if (player1.isActive) {
            gameboard.updateBoardSquare(index, player1.marker);
          } else {
            gameboard.updateBoardSquare(index, player2.marker);
          }

          if (gameboard.isThreeInARow(player1.marker)) {
            displayWinner(player1);
            gameboard.gameboardDiv.classList.add('game-over');
          } else if (gameboard.isThreeInARow(player2.marker)) {
            displayWinner(player2);
            gameboard.gameboardDiv.classList.add('game-over');
          }
  
          player1.isActive = !player1.isActive;
          player2.isActive = !player2.isActive;
        }
      }
    });
  }

  const displayWinner = (player) => {
    const resultDiv = document.querySelector('.result');
    const resultP = document.createElement('p');
    resultP.textContent = `${player.name} wins!`;
    resultDiv.appendChild(resultP);
  }

  return {playGame};
})();

const playerFactory = (name, marker, isActive) => {
  return {name, marker, isActive};
};

game.playGame();
