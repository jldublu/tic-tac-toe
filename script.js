'use strict';

const displayController = (() => {
  const gameboardDiv = document.querySelector('.gameboard');
  const modal = document.querySelector('.modal');
  const closeModal = document.querySelector('.close');

  window.onload = () => {
    modal.style.display = 'block';
  };

  const createBoard = () => {
    for (let i = 0; i < 9; i++) {
      const boardSquare = document.createElement('div');
      boardSquare.classList.add('board-square');
      boardSquare.setAttribute('data-index', i);
      gameboardDiv.appendChild(boardSquare);
    }
  };

  const displayGameOver = (resultText) => {
    const resultDiv = document.querySelector('.result');
    const resultP = document.createElement('p');
    
    resultP.textContent = resultText;
    resultDiv.appendChild(resultP);

    gameboardDiv.classList.add('game-over');
  };

  return {createBoard, displayGameOver, gameboardDiv}
})();

let gameboard = (() => {
  let gameboard = ['', '', '', '', '', '', '', '', ''];

  const updateBoardSquare = (index, marker) => {
    const boardSquare = document.querySelector(`div[data-index='${index}']`);
    boardSquare.textContent = marker;
    gameboard.splice(index, 1, marker);
  };

  const hasEmptySpaces = () => {
    return gameboard.includes('');
  }

  const isBoardSquareEmpty = (index) => {
    return gameboard[index] === '';
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

  return {hasEmptySpaces, isBoardSquareEmpty, isThreeInARow, updateBoardSquare};
})();

let game = (() => {
  const playGame = () => {
    displayController.createBoard();
    const player1 = playerFactory('player1', 'X', true);
    const player2 = playerFactory('player2', 'O', false);

    displayController.gameboardDiv.addEventListener('click', (event) => {
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
            displayController.displayGameOver(`${player1.name} wins!`);
          } else if (gameboard.isThreeInARow(player2.marker)) {
            displayController.displayGameOver(`${player2.name} wins!`);
          } else if (!gameboard.hasEmptySpaces()) {
            displayController.displayGameOver('Tie!');
          }
  
          player1.isActive = !player1.isActive;
          player2.isActive = !player2.isActive;
        }
      }
    });
  }

  return {playGame};
})();

const playerFactory = (name, marker, isActive) => {
  return {name, marker, isActive};
};

game.playGame();