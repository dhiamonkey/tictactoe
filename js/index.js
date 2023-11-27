function updateGameStatus() {
  let message;
  if (ttt.isWon()) {
    message = "🎉 " + player.getCurrentPlayer() + " won! 🎉";
    document.getElementById("gameStatus").style = "color: green";
  } else if (ttt.isDraw()) {
    message = "Game is Draw!";
  } else {
    message = player.getNextPlayer() + "'s turn:";
  }
  document.getElementById("gameStatus").innerHTML = message;
}

function play(e) {
  e.stopPropagation();
  if (e.target.id && !document.getElementById(e.target.id).innerHTML) {
    let playerSymbol = player.getPlayerSymbol();
    document.getElementById(e.target.id).innerHTML = playerSymbol;
    ttt.checkWinPattern(playerSymbol, e.target.id);
    updateGameStatus();
  }
}

function initializeGame(boardSize, parentNodeId, player1, player2) {
  ttt.initialize(boardSize, parentNodeId);
  player.initialize(player1, player2);
  document.getElementById("gameStatus").innerHTML =
    player.getCurrentPlayer() + "'s turn:";
}

function toggleScreen() {
  document.getElementById("gameInputs").style.display =
    document.getElementById("gameInputs").style.display === "none"
      ? "flex"
      : "none";
  document.getElementById("gameContainer").style.display =
    document.getElementById("gameContainer").style.display === "flex"
      ? "none"
      : "flex";
}

function startGame() {
  let gameSize = parseInt(document.getElementById("gameSize").value);
  let player1 = document.getElementById("player1").value;
  let player2 = document.getElementById("player2").value;

  if (gameSize >= 3 && player1 && player2) {
    initializeGame(gameSize, "game", player1, player2);
    toggleScreen();
  } else {
    alert(
      "Please enter the player names and the size of the Tic Tac Toe! (Minimum Size: 3)"
    );
  }
}

let ttt = (function () {
  let won;
  let filled;
  let size;
  let counters = {};

  function createGameBoard(size, parentNodeId) {
    let parent = document.getElementById(parentNodeId);
    let fragment = document.createDocumentFragment();

    parent.innerHTML = "";

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let element = document.createElement("div");
        element.id = "" + i + j;
        element.style.flexBasis = 100 / size - 1 + "%";
        fragment.appendChild(element);
      }
    }

    parent.appendChild(fragment);
  }

  return {
    initialize: function (s, parentNodeId) {
      size = s;
      filled = 0;
      won = false;
      counters = {};
      createGameBoard(size, parentNodeId);
    },
    isWon: function () {
      return won;
    },
    isDraw: function () {
      return !won && filled === size * size;
    },
    checkWinPattern: function (icon, currentPosition) {
      ++filled;
      let [row, column] = currentPosition.split("");
      const rowCounter = icon + "r" + row;
      const columnCounter = icon + "c" + column;
      const firstDiagonalCounter = icon + "d1";
      const secondDiagonalCounter = icon + "d2";

      counters[rowCounter] = counters[rowCounter]
        ? counters[rowCounter] + 1
        : 1;
      counters[columnCounter] = counters[columnCounter]
        ? counters[columnCounter] + 1
        : 1;

      if (row === column) {
        counters[firstDiagonalCounter] = counters[firstDiagonalCounter]
          ? counters[firstDiagonalCounter] + 1
          : 1;
      }

      if (parseInt(row) === size - column - 1) {
        counters[secondDiagonalCounter] = counters[secondDiagonalCounter]
          ? counters[secondDiagonalCounter] + 1
          : 1;
      }

      if (
        counters[rowCounter] === size ||
        counters[columnCounter] === size ||
        counters[firstDiagonalCounter] === size ||
        counters[secondDiagonalCounter] === size
      ) {
        won = true;
      }
    },
  };
})();

let player = (function () {
  let player;
  let playerNames;
  return {
    initialize: function (name1, name2) {
      player = 1;
      playerNames = [name1, name2];
    },
    getCurrentPlayer: function () {
      return playerNames[player - 1];
    },
    getNextPlayer: function () {
      player = player === 1 ? 2 : 1;
      return playerNames[player - 1];
    },
    getPlayerSymbol: function () {
      return player === 1 ? "X" : "O";
    },
  };
})();
