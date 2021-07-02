const socket = io();
let match = false;
function checkMatchedCard() {
  if (match == 'true') {
    console.log('hey, this is a match');
  }
}

async function displayCardPile(dealtCard) {
  const cardPileDiv = document.getElementById('card-pile');
  cardPileDiv.addEventListener('click', async () => {
    console.log('card pile got clicked');
    const cardPile = await axios.get('/cards').then((response) => {
      console.log(response);
      console.log('card pile data: ');
      const popedCard = response.data;
      const cardSuit = document.createElement('h3');
      cardSuit.innerText = popedCard.suit;
      cardPileDiv.appendChild(cardSuit);

      const cardRank = document.createElement('p');
      cardRank.innerText = popedCard.rank;
      cardPileDiv.appendChild(cardRank);
      cardPileDiv.setAttribute('class', popedCard.suit);

      //
      for (let i = 0; i < dealtCard.length; i += 1) {
        if (dealtCard[i].rank == popedCard.rank || dealtCard[i].suit == popedCard.suit) {
          console.log('match found');
          match = 'true';
        }
      }
      //
    }).catch((err) => {
      console.log(err);
    });
  });
}
function createCardPile(playerHand) {
  const gameContainer = document.getElementById('game-started');
  const cardPile = document.createElement('div');
  cardPile.setAttribute('id', 'card-pile');
  // cardPile.innerText = 'waiting for another player';
  gameContainer.appendChild(cardPile);
  displayCardPile(playerHand);
}

/**
 * when game is started. create game element.
 * @ params: playerCards: array of player's card. received as a respons of get resquest to the game.
 */
function createGameElement(playersCards, player) {
  const gameCanvasDiv = document.getElementById('game-started');
  const cardContainer = document.createElement('div');
  cardContainer.setAttribute('class', 'row');
  gameCanvasDiv.appendChild(cardContainer);
  for (let i = 0; i < playersCards.length; i += 1) {
    const cardDiv = document.createElement('div');
    cardDiv.setAttribute('id', 'card');
    cardDiv.setAttribute('class', `col, ${playersCards[i].suit}`);
    const cardTitle = document.createElement('h3');
    cardTitle.innerText = playersCards[i].suit;
    const cardRank = document.createElement('p');
    cardRank.innerText = playersCards[i].rank;
    cardDiv.appendChild(cardTitle);
    cardDiv.appendChild(cardRank);
    cardContainer.appendChild(cardDiv);
    cardDiv.addEventListener('click', (e) => {
      console.log(e);
      checkMatchedCard();
    });
  }
  // const cardPile = !!document.getElementById('card-pile');
  // console.log('Is Not null?', cardPile);
  console.log(`player: ${player}`);
  if (player == 'firstPlayer') {
    console.log('card pile does not exists. calling create card pile');
    createCardPile(playersCards);
  } else if (player == 'secondPlayer') {
    console.log('card pile exists. calling DISPLAy card pile');
    createCardPile(playersCards);
    displayCardPile(playersCards);
  }
}

// /**
//  * display card pile
//  */
// function cardPile(gameCanvas) {
//   const cardPileDiv = document.createElement('div');
//   cardPileDiv.setAttribute('id', 'card-pile');
//   gameCanvas.appendChild(cardPileDiv);
// }
/**
 * @param currentPlayer : player who joined the game.
 * axios request creates a game and draws 7 cards for the player.
 * if the game already exists then axios request will deal 7 cards to the player.
 */
async function gameStarted() {
  // get rid of the play btn
  const playBtn = document.getElementById('play-btn');
  playBtn.style.display = 'none';
  // make the game canvas visible.
  const gameDiv = document.getElementById('game-started');
  gameDiv.style.display = 'block';
  await axios.get('/game').then((response) => {
    console.log(response);
    console.log('response data after get game');
    // console.log(response.data);
    // createGameElement(response.data);
    createGameElement(response.data[0], response.data[1]);
    // console.log(response.data[1]);
  }).catch((err) => {
    console.log(err);
  });
  // create the elements inside game canvas.
}

async function playGame(currentPlayer) {
  console.log('play game func running');
  await axios.post('/game', { currentPlayer }).then((response) => {
    console.log(response);
    console.log('response data after post');
    console.log(response.data);
  }).catch((err) => {
    console.log(err);
  });
  // get rid of the 'play' btn. Take the user to the next screen
  gameStarted();
}

// function to display start game btn
function startGamePage(joinedPlayer) {
  const introContaine = document.getElementById('intro-container');
  introContaine.style.display = 'none';
  const playGameDiv = document.getElementById('play-game');
  playGameDiv.style.display = 'block';
  const playBtn = document.getElementById('play-btn');
  playBtn.addEventListener('click', () => {
    playGame(joinedPlayer);
  });
}
// function creates a new user
async function createPlayer(player) {
  await axios.post('/', { player }).then((response) => {
    console.log(response);
  });
  console.log('PLAYER IS CREATED. NOW WILL DISPLAY THE PLAY BTN');
  startGamePage(player);
}
/**
 * 1st screen logics.
 * select the join button ans listen to click event
 */
const startBtn = document.getElementById('join-btn');
startBtn.addEventListener('click', () => {
  console.log('join btn is clicked');
  const playerName = document.getElementById('player-name').value;
  console.log(playerName);
  createPlayer(playerName);
  // socket.emit('player', playerName);
  // socket.emit('welcome message', `${playerName} has joined the game`);
  // playerName=''
});
socket.on('welcome message', (msg) => {
  const p = document.createElement('p');
  p.textContent = msg;
  document.body.appendChild(p);
  window.scrollTo(0, document.body.scrollHeight);
});
