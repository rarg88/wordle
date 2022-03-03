const { add } = require('lodash');

require('./bootstrap');

let wordle;

const tileDisplay = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');


const keys = [
  'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ', 'ENVIAR', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<<',
];

const guessRows = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;
let find = false;
let words;

const loadWordle = () => {
  axios.get('/wordle')
    .then(function (response) {
      // handle success
      wordle = response.data.wordle.toUpperCase();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });

};

const loadJson = (file, callback) => {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', file, true); // Replace 'file' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function loadWords() {
  loadJson('/palabras.json', function (response) {
    words = JSON.parse(response);
  });
}

//Load Wordle
loadWordle();
//Load all words
loadWords();

guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement('div');
  rowElement.setAttribute('id', 'guessRow-' + guessRowIndex);
  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement('div');
    tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
    tileElement.classList.add('tile');
    rowElement.appendChild(tileElement);
  });
  tileDisplay.append(rowElement);
});

keys.forEach(key => {
  const buttonElement = document.createElement('button');
  buttonElement.textContent = key;
  buttonElement.setAttribute('id', key);
  buttonElement.addEventListener('click', () => handleClick(key));
  keyboard.append(buttonElement);
});


const handleClick = (letter) => {
  if (!isGameOver) {
    if (letter === '<<') {
      deleteLetter();
      return;
    }
    if (letter === "ENVIAR") {
      checkRow();
      return;
    }
    addLetter(letter);
  }
}

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
    tile.textContent = letter;
    tile.setAttribute('data', letter);
    guessRows[currentRow][currentTile] = letter;
    currentTile++;
  }
}

const deleteLetter = () => {
  if (currentTile != 0) {
    currentTile--;
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
    tile.textContent = '';
    tile.setAttribute('data', '');
    guessRows[currentRow][currentTile] = '';
  }
}

const checkRow = () => {
  const guess = guessRows[currentRow].join('');
  if (currentTile > 4) {
    checkWord(guess);
    if (!find) {
      showMessage('La palabra no esta en el diccionario', 0);
      return;
    } else {
      find = false;
      flipTile();
      if (wordle === guess) {
        showMessage('Magnífico', 2500);
        isGameOver = true;
        return;
      } else {
        if (currentRow >= 5) {
          isGameOver = true;
          showMessage('Game Over', 2500);
          return;
        }
        if (currentRow < 5) {
          currentRow++;
          currentTile = 0;
        }
      }
    }
  }
}

const showMessage = (message, interval) => {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  setTimeout(() => {
    messageDisplay.append(messageElement);
    setTimeout(() => {
      messageDisplay.removeChild(messageElement);
    }, 3000);
  }, interval);
}

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);
  key.classList.add(color);
}


const flipTile = () => {
  const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
  let checkWordle = wordle;
  const guess = [];

  rowTiles.forEach((tile) => {
    const dataLetter = tile.getAttribute('data');
    guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' })
  });

  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = 'green-overlay';
      checkWordle = checkWordle.replace(guess.letter, '');
    }
  });

  guess.forEach((guess, index) => {
    if (checkWordle.includes(guess.letter) && guess.letter != wordle[index]) {
      guess.color = 'yellow-overlay';
      checkWordle = checkWordle.replace(guess.letter, '');
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add('flip');
      tile.classList.add(guess[index].color)
      addColorToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });

}

const checkWord = (word) => {
  for (let i = 0; i < words.palabras.length && !find; i++) {
    if (words.palabras[i]['palabra'] == word.toLowerCase()) {
      find = true;
    }
  }
};