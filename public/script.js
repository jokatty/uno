/**
 * STEP 8
 * get add card btn and attach an event listener to it.
 */
const addCard = document.getElementById('add-card');
addCard.addEventListener('click', () => {
  const suit = (`;${document.cookie}`).split('; suit=').pop().split(';').shift();
  const rank = (`;${document.cookie}`).split('; rank=').pop().split(';').shift();
  // display the card in player's side
  const cardRow = document.getElementById('card-row');
  const cardDiv = document.createElement('div');
  cardDiv.setAttribute('class', `col, ${suit}`);
  const cardTitle = document.createElement('h3');
  cardTitle.innerText = suit;
  const cardRank = document.createElement('h6');
  cardRank.setAttribute('class', 'dynamic-rank');
  cardRank.innerText = rank;
  cardDiv.appendChild(cardTitle);
  cardDiv.appendChild(cardRank);
  cardRow.appendChild(cardDiv);
  cardDiv.addEventListener('click', () => {
    cardDiv.remove();
    // reset the pile card to show the 'flip me message'
    const resetSuit = document.getElementById('suit');
    console.log('newly added card, flip me works');
    resetSuit.innerText = 'Flip me!!';
    const resetRank = document.getElementById('rank');
    resetRank.innerText = '';
  });
  // reset the pile card to show the 'flip me message'
  const resetSuit = document.getElementById('suit');
  console.log('add card, flip me works');
  resetSuit.innerText = 'Flip me!!';
  const resetRank = document.getElementById('rank');
  resetRank.innerText = '';
});

/**
 * STEP 7
 * make request to db for poped card data.
 */
async function getPopedCardData() {
  const response = await axios.get('/cards');
  const rank = document.getElementById('rank');
  const suit = document.getElementById('suit');
  rank.innerText = response.data.rank;
  suit.innerText = response.data.suit;
  // apply cass to the poped card
  const popedCard = document.getElementById('poped-card');
  popedCard.setAttribute('class', response.data.suit);
}
/**
 * STEP 6
 * @param: playersCards: player's hand cards information
 * @param: playerName: player who joined the game
 */
function createPlayersCard(playersCards, playerName) {
  const cardRow = document.getElementById('card-row');
  for (let i = 0; i < playersCards.length; i += 1) {
    const cardDiv = document.createElement('div');
    cardDiv.setAttribute('id', `card${i}`);
    cardDiv.setAttribute('class', `col, ${playersCards[i].suit}`);
    const cardTitle = document.createElement('h3');
    cardTitle.innerText = playersCards[i].suit;
    const cardRank = document.createElement('h6');
    cardRank.setAttribute('class', 'dynamic-rank');
    cardRank.innerText = playersCards[i].rank;
    cardDiv.appendChild(cardTitle);
    cardDiv.appendChild(cardRank);
    cardRow.appendChild(cardDiv);
    cardDiv.addEventListener('click', () => {
      cardDiv.remove();
      const matchAudio = new Audio('match.wav');
      matchAudio.play();
      // reset the pile card to show the 'flip me message'
      const resetSuit = document.getElementById('suit');
      resetSuit.innerText = 'Flip me!!';
      const resetRank = document.getElementById('rank');
      resetRank.innerText = '';
    });
  }
}
/**
 * STEP 5
 * hide the 'play' button
 * make the card display area visible.
 */
async function gameStarted() {
  // get rid of the rule div
  const ruleDiv = document.getElementById('rule-div');
  // ruleDiv.style.display = 'none';
  ruleDiv.setAttribute('class', '.d-none');
  // get rid of the card
  const ruleCard = document.getElementById('rule-div');
  ruleCard.style.display = 'none';
  // get rid of the play btn
  const playBtn = document.getElementById('play-btn');
  playBtn.style.display = 'none';
  // make the game canvas visible.
  const gameDiv = document.getElementById('game-started');
  gameDiv.style.display = 'block';
  // make a call to backend and get player's data:
  const response = await axios.get('/game');
  //  use the player's hand data we received from backend and display player's cards.
  createPlayersCard(response.data[0], response.data[1]);

  // display the pile card
  const popedCard = document.getElementById('poped-card');
  popedCard.addEventListener('click', () => {
    getPopedCardData();
    //  check if the # of players hand is 1:
    const playersHand = document.getElementById('card-row').childElementCount;
    if (playersHand == 1) {
      // alert('UNO!!');
      // window.location.reload();
      const successMsg = document.getElementById('success-msg');
      successMsg.style.display = 'block';
      const audio = new Audio('won.flac');
      audio.play();
      const playAgain = document.getElementById('play-again');
      playAgain.addEventListener('click', () => {
        window.location.reload();
      });
    }
  });
}

/**
 * STEP 4
 * call back for 'PLAY BTN', when user clicks to play
 * A player is created and a game is created in DB
 */
async function playGame(currentPlayer) {
  await axios.post('/game', { currentPlayer });
  gameStarted();
}

/**
 * STEP 3
 * AFTER player is cretaed in the DB.
 * display PLAY button
 * function to display start game btn
 * @param joinedPlayer is the 'player name' who started the game
 */
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
/**
 * STEP 2
 * call back function for JOIN GAME
 */
async function createPlayer(player) {
  await axios.post('/', { player });
  startGamePage(player);
}
/**
 * STEP 1
 * when join game button is clicked
 */
const joinBtn = document.getElementById('join-btn');
joinBtn.addEventListener('click', () => {
  const playerName = document.getElementById('player-name').value;
  // get the payer name form the input field and pass it along
  createPlayer(playerName);
});
