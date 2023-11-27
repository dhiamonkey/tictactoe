////// INDEX
// function to update game status
function updateGameStatus() {
  let message;
  if (ttt.isWon()) {
    message = player.getCurrentPlayer() + " won! 🎉";
    document.getElementById("gameStatus").style.color = "green";
  } else if (ttt.isDraw()) {
    message = "Game Draw!";
  } else {
    message = player.getNextPlayer() + "'s turn:";
  }
  document.getElementById("gameStatus").innerHTML = message;
}

// function to play each move
function play(e) {
  e.stopPropagation();
  if (e.target.id && !document.getElementById(e.target.id).innerHTML) {
    // play move
    let playerSymbol = player.getPlayerSymbol();
    document.getElementById(e.target.id).innerHTML = playerSymbol;

    // check if player won
    ttt.checkWinPattern(playerSymbol, e.target.id);

    // update game status
    updateGameStatus();
  }
}

// function to initialize game
function initializeGame(boardSize, parentNodeId, player1, player2) {
  // setting up Tic Tac Toe
  ttt.initialize(boardSize, parentNodeId);

  // setting up Players
  player.initialize(player1, player2);
  document.getElementById("gameStatus").innerHTML =
    player.getCurrentPlayer() + "'s turn:";
}

function toggleScreen() {
  // function to display either gameInputs or gameContainer
  document.getElementById("gameInputs").style.display =
    document.getElementById("gameInputs").style.display === "none"
      ? "flex"
      : "none";
  document.getElementById("gameContainer").style.display =
    document.getElementById("gameContainer").style.display === "flex"
      ? "none"
      : "flex";
}

// function to start the game with appropriate inputs
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

//// TICTACTOE

// Tic Tac Toe module
let ttt = (function () {
  let won;
  let filled;
  let size;
  let counters = {};

  // function to create game board
  // has quadratic time complexity
  function createGameBoard(size, parentNodeId) {
    let parent = document.getElementById(parentNodeId);
    let fragment = document.createDocumentFragment(); // Create a document fragment

    parent.innerHTML = ""; // Clear existing board, if any

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let element = document.createElement("div");
        element.id = "" + i + j;
        element.style.flexBasis = 100 / size - 1 + "%";
        fragment.appendChild(element); // Append to the fragment
      }
    }

    parent.appendChild(fragment); // Append the fragment to the DOM
  }

  return {
    initialize: function (s, parentNodeId) {
      // function to initialize game params
      size = s;
      filled = 0;
      won = false;
      counters = {};
      createGameBoard(size, parentNodeId);
    },
    isWon: function () {
      // function to check if game is won
      return won;
    },
    isDraw: function () {
      // function to check if game is drawn
      return !won && filled === size * size;
    },
    checkWinPattern: function (icon, currentPosition) {
      // algorithm to update game patterns and check for win situation
      // has constant time complexity
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

//// PLAYER

// Player module
let player = (function () {
  let player;
  let playerNames;
  return {
    initialize: function (name1, name2) {
      // function to initlialize players
      player = 1;
      playerNames = [name1, name2];
    },
    getCurrentPlayer: function () {
      // funtion to get current player's name
      return playerNames[player - 1];
    },
    getNextPlayer: function () {
      // function to update next player and return his/her name
      player = player === 1 ? 2 : 1;
      return playerNames[player - 1];
    },
    getPlayerSymbol: function () {
      // function to get player icon
      return player === 1 ? "X" : "O";
    },
  };
})();
