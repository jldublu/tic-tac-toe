'use strict';

const displayController = (() => {
  const gameboardDiv = document.querySelector('.gameboard');
  const modal = document.querySelector('.modal');
  const resultDiv = document.querySelector('.result');

  window.onload = () => {
    displayModal();
  };

  const createBoard = () => {
    for (let i = 0; i < 9; i++) {
      const boardSquare = document.createElement('div');
      boardSquare.classList.add('board-square');
      boardSquare.setAttribute('data-index', i);
      gameboardDiv.appendChild(boardSquare);
      gameboardDiv.classList.remove('hidden');
    }
  };

  const displayGameOver = (resultText) => {
    resultDiv.textContent = resultText;
    gameboardDiv.classList.add('game-over');
  };

  const displayModal = () => {
    modal.style.display = 'block';
  };

  const displayRestartButton = () => {
    restartController.restartButton.classList.remove('hidden');
  };

  const hideElement = (element) => {
    element.classList.add('hidden');
  };

  const removeResult = () => {
    resultDiv.textContent = '';
  };

  return {createBoard, displayGameOver, displayModal, displayRestartButton, gameboardDiv, hideElement, removeResult}
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

  const reset = () => {
    for (let i = 0, len = gameboard.length; i < len; i++) {
      updateBoardSquare(i, '');
    }
  }

  return {hasEmptySpaces, isBoardSquareEmpty, isThreeInARow, reset, updateBoardSquare};
})();

let game = (() => {
  let player1;
  let player2;

  const startGame = (player1Name, player1Marker, player2Name, player2Marker) => {
    displayController.createBoard();
    displayController.displayRestartButton();

    player1 = playerFactory(player1Name, player1Marker, true);
    player2 = playerFactory(player2Name, player2Marker, false);
  };

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

  return {startGame};
})();

let modalController = (() => {
  let modal = document.querySelector('.modal');
  let form = document.querySelector('.start-form');
  let errorDiv = document.querySelector('.error');

  //captures player info and starts game on submission
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const player1Name = document.getElementById('player1-name').value;
    const player1Marker = document.querySelector('input[name="player1-marker"]:checked + span').textContent;

    const player2Name = document.getElementById('player2-name').value;
    const player2Marker = document.querySelector('input[name="player2-marker"]:checked + span').textContent;

    if (player1Marker == player2Marker) {
      errorDiv.textContent = 'Player markers should be unique.';
    } else {
      game.startGame(player1Name, player1Marker, player2Name, player2Marker);
      closeModal();
    }
  });

  const closeModal = () => {
    modal.style.display = 'none';
  };
})();

let restartController = (() => {
  const restartButton = document.querySelector('.restart');

  restartButton.addEventListener('click', () => {
    displayController.removeResult();
    displayController.gameboardDiv.classList.remove('game-over');

    gameboard.reset();
  });

  return {restartButton};
})();

const playerFactory = (name, marker, isActive) => {
  return {name, marker, isActive};
};