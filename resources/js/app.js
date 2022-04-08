const { add } = require('lodash');

require('./bootstrap');

let wordle;
let wordleResult;

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

const guessResults = [
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
let victory = false;
let find = false;
let words;
let tries = 0;

const loadWordle = () => {
  axios.get('/wordle')
    .then(function (response) {
      // handle success
      wordle = response.data.wordle.toUpperCase();
      wordleResult = response.data.wordle;
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
      tries++;
      find = false;
      flipTile();
      if (wordle === guess) {
        showMessage('Magnífico', 2500);
        isGameOver = true;
        victory = true;
        setTimeout(() => {
          finishGame();
        }, 3500);
        return;
      } else {
        if (currentRow >= 5) {
          isGameOver = true;
          showMessage('Game Over', 2500);
          setTimeout(() => {
            finishGame();
          }, 3500);
          return;
        }
        if (currentRow < 5) {
          currentRow++;
          currentTile = 0;
        }
      }
    }
  } else {
    showMessage('No hay suficientes letras para una palabra', 0);
  }
}

const showMessage = (message, interval) => {
  const messageContainer = document.querySelector('.message-container');
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  setTimeout(() => {
    messageContainer.append(messageElement);
    setTimeout(() => {
      messageContainer.removeChild(messageElement);
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

  rowTiles.forEach((tile, index) => {
    const dataLetter = tile.getAttribute('data');
    guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' })
    guessResults[currentRow][index] = '⬛️';
  });

  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = 'green-overlay';
      checkWordle = checkWordle.replace(guess.letter, '');
      guessResults[currentRow][index] = '🟩';
    }
  });

  guess.forEach((guess, index) => {
    if (checkWordle.includes(guess.letter) && guess.letter != wordle[index]) {
      guess.color = 'yellow-overlay';
      checkWordle = checkWordle.replace(guess.letter, '');
      guessResults[currentRow][index] = '🟨';

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

const copyRichText = (text) => {
  const mySmartTextarea = document.createElement('textarea');
  mySmartTextarea.setAttribute('id', 'copyArea');
  mySmartTextarea.innerHTML = text;
  document.body.appendChild(mySmartTextarea);
  mySmartTextarea.select();
  document.execCommand('copy');
  document.getElementById('copyArea').remove();
};

const finishGame = () => {

  if (!victory) tries = 'X';

  registerResult(tries);

  let resultText = '';
  let resultEmoji = '';
  let finishResult = false;
  resultText += 'Wordle Evidenze ' + tries + '/6\r\n\r\n'
  guessResults.forEach(row => {
    row.forEach(letter => {
      if (letter != '') {
        resultEmoji += letter + ' ';
      } else {
        finishResult = true;
      }
    });
    if (!finishResult) {
      resultEmoji += '\r\n';
    }
  });

  resultText += resultEmoji;
  resultText += '\r\n\r\nhttps://wordle.s3ways.es'

  const shareData = {
    title: 'Wordle',
    text: resultText,
  }
  const game = document.querySelector('.game-container');
  while (game.firstChild) {
    game.removeChild(game.lastChild);
  }
  game.classList.add('text-white');
  game.classList.add('text-center');
  let divMessage = document.createElement('div');
  divMessage.classList.add('message-container');
  game.appendChild(divMessage);
  let divResult = document.createElement('div');
  divResult.classList.add('py-5');
  game.appendChild(divResult);
  let header = document.createElement('h3');
  header.innerHTML = 'Wordle Evidenze ' + tries + '/6';
  divResult.appendChild(header);
  let pResult = document.createElement('p');
  pResult.classList.add('py-5');
  resultEmoji = resultEmoji.replaceAll('\r\n', '<br>');
  pResult.innerHTML = resultEmoji;
  divResult.appendChild(pResult);
  let pStats = document.createElement('p');
  pStats.innerHTML = 'Estadísticas';
  pStats.classList.add('py-5');
  divResult.appendChild(pStats);
  let divRow = document.createElement('div');
  divRow.classList.add('row');
  divRow.classList.add('py-5');
  let divJugadas = document.createElement('div');
  divJugadas.classList.add('col-6');
  divJugadas.classList.add('pb-3');
  divJugadas.innerHTML = '<h3>1</h3><small>Jugadas</small>';
  let divVictorias = document.createElement('div');
  divVictorias.classList.add('col-6');
  divVictorias.classList.add('pb-3');
  if (victory) {
    divVictorias.innerHTML = '<h3>100%</h3><small>Victorias</small>';
  } else {
    divVictorias.innerHTML = '<h3>0%</h3><small>Victorias</small>';
  }

  let buttonElement = document.createElement('button');
  buttonElement.classList.add('btn');
  buttonElement.classList.add('btn-success');
  if (navigator.canShare) {
    buttonElement.innerHTML = 'Compartir resultados';
    buttonElement.setAttribute('id', 'share');
    buttonElement.addEventListener('click', async () => {
      try {
        await navigator.share(shareData);
        // resultPara.textContent = 'MDN shared successfully'
      } catch (err) {
        console.log(err);
        // resultPara.textContent = 'Error: ' + err
      }
    });
  } else {
    buttonElement.innerHTML = 'Copiar resultados';
    buttonElement.setAttribute('id', 'share');
    buttonElement.addEventListener('click', () => {
      copyRichText(resultText);
      showMessage('Resultado copiado al portapapeles', 0);
    });
  }

  divRow.appendChild(divJugadas);
  divRow.appendChild(divVictorias);
  divRow.appendChild(buttonElement);
  divResult.appendChild(divRow);

}

//registro resultado
const registerResult = (intentos) => {
  $.ajax({
    url: location.origin + '/save-result',
    type: 'post',
    data: {
      'wordle': wordleResult,
      'intentos': intentos
    },
    success: function (response) {

    },
    statusCode: {
      404: function () {
        console.log('error 404')
      }
    },
    error: function (x, xs, xt) {
    }
  });
}

$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});