// Setting up game variables

let cellSelected = [];
let count = 1;
let indexCount;
let nowCell;
let selectedPath = [];
let correctPath = [];
let isPlaying = false;
let gridSize = 4;
let lifeCount = 3;
let repeatCount = 3;
let warningCount = 1;
let gameTimeout;

// DOM Elements

const gameScreen = document.querySelector(".game-screen");
const gameBoard = document.querySelector(".game-board");
const lifeMeter = document.querySelector("#life");
const repeatMeter = document.querySelector("#path-repeater");
const warningMeter = document.querySelector("#warning-friends");
const startButton = document.querySelector("#start-button");
const resetButton = document.querySelector("#reset-button");
const showButton = document.querySelector("#show-button");
const messageDisplay = document.querySelector("#play-message");
const cells = document.querySelector(".game-board");
const playDiv = document.querySelector(".play");

// Event listeners
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

showButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (warningCount > 0) {
    if (correctPath[1][1] > 0) {
      player("show2.mp3");
      warningCount--;
      warningMeter.textContent = `${warningCount}`;
      messageDisplay.textContent = `Showing path: ${correctPath}`;
      for (let i = 0; i < gridSize; i++) {
        let [row, col] = correctPath[i];
        let cell = document.querySelector(`#row-${row}-${col}`);
        cell.classList.add("island-correct");
        setTimeout(() => {
          cell.classList.remove("island-correct");
        }, 500);
      }
    } else {
      messageDisplay.textContent = `Start Game To See Path!`;
      player("nana-p.m4a");
    }
  } else {
    messageDisplay.textContent = `You Do Not Have Enough Warning Friends To Show Path!`;
    player("nana-p.m4a");
  }
});

cells.addEventListener("click", function (e) {
  if (correctPath[1][1] >= 1) {
    for (let row = 1; row <= gridSize; row++) {
      for (let col = 1; col <= gridSize; col++) {
        if (e.target.className == `island row-${row}-${col}`) {
          if (row == count) {
            player("step.m4a");
            indexCount = count - 1;
            selectedPath[indexCount] = [row, col];
            messageDisplay.textContent = `You Selected Cell: row-${row}-${col}`;
            nowCell = document.querySelector(`.row-${row}-${col}`);
            nowCell.classList.add("island-select");
            count++;
            if (count > 4) {
              count = 1;
              checkPath();
            }
          } else if (count > 4) {
            count = 1;
            checkPath();
          }
        }
      }
    }
  }
});

function player(song) {
  playDiv.innerHTML = `<audio src="${song}" autoplay>Browser Not Supported</audio>`;
}

// Generate a random correct path
function generatePath() {
  player("make.mp3");
  correctPath = [];
  for (let i = 0; i < gridSize; i++) {
    let row = i;
    row++;
    let col = Math.floor(Math.random() * gridSize);
    col++;
    correctPath[i] = [row, col];
    messageDisplay.textContent = `${correctPath}`;
  }
}

// Show the correct path for a few seconds

function showPath() {
  messageDisplay.textContent = `Showing path: ${correctPath}`;
  for (let i = 0; i < gridSize; i++) {
    let [row, col] = correctPath[i];
    let cell = document.querySelector(`#row-${row}-${col}`);
    cell.classList.add("island-select");

    setTimeout(() => {
      cell.classList.remove("island-select");
    }, 800);
  }
  messageDisplay.textContent = `Path is gone`;
}

// Start the game
function startGame() {
  messageDisplay.textContent = `Game Is Starting`;
  if (isPlaying) {
    messageDisplay.textContent = `Game Is In Progress`;
    player("inprogress.m4a");
    return;
  }
  isPlaying = true;
  generatePath();
  showPath();
  setTimeout(() => {
    messageDisplay.textContent = "Lets Play! Select The Right Path";
  }, 1000);
}

// Reset the game
function resetGame() {
  player("greset.m4a ");
  selectedPath = [];
  correctPath = [];
  lifeCount = 3;
  repeatCount = 3;
  warningCount = 1;
  count = 1;
  isPlaying = false;
  // clearTimeout(gameTimeout);
  // gameScreen.classList.remove("hidden");
  // playScreen.classList.add("hidden");
  lifeMeter.textContent = lifeCount;
  repeatMeter.textContent = repeatCount;
  warningMeter.textContent = warningCount;
  messageDisplay.textContent = "Game Reset";
  for (let row = 1; row <= gridSize; row++) {
    for (let col = 1; col <= gridSize; col++) {
      let cell = document.getElementById(`row-${row}-${col}`);
      cell.classList.remove("island-select");
      cell.classList.remove("island-correct");
      cell.classList.remove("island-wrong");
    }
  }
  // gameScreen.classList.remove("game-screen-off");
}

// Check if the selected path is correct
function checkPath() {
  if (JSON.stringify(selectedPath) === JSON.stringify(correctPath)) {
    messageDisplay.textContent = "Correct path!";
    player("nana-r-p.m4a");
    lifeCount++;
    lifeMeter.textContent = lifeCount;
    isPlaying = false;
    correctPath = [];
    for (let row = 1; row <= gridSize; row++) {
      for (let col = 1; col <= gridSize; col++) {
        let cell = document.getElementById(`row-${row}-${col}`);
        cell.classList.remove("island-select");
        cell.classList.remove("island-correct");
        cell.classList.remove("island-wrong");
      }
    }
    if (powerUpsCount < 3) {
      powerUpsCount++;
    }
    resetGame();
  } else {
    messageDisplay.textContent = "Wrong path!";
    player("nana-w-p.m4a");
    lifeCount--;
    lifeMeter.textContent = lifeCount;
    isPlaying = false;
    for (let row = 1; row <= gridSize; row++) {
      for (let col = 1; col <= gridSize; col++) {
        let cell = document.getElementById(`row-${row}-${col}`);
        cell.classList.remove("island-select");
        cell.classList.remove("island-correct");
        cell.classList.remove("island-wrong");
      }
    }
    if (lifeCount === 0) {
      messageDisplay.textContent = "Game over";
      gameTimeout = setTimeout(() => {
        resetGame();
      }, 1000);
    } else {
      let warningMessage = "";
      if (warningCount > 0) {
        warningCount--;
        warningMessage = "Be careful, wrong path selected!";
      }
    }
  }
}
