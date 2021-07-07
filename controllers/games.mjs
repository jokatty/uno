/*
 * ========================================================
 *                  Card Deck Functions
 * ========================================================
 */

// get a random index from an array given it's size
const getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

// cards is an array of card objects
const shuffleCards = function (cards) {
  let currentIndex = 0;

  // loop over the entire cards array
  while (currentIndex < cards.length) {
    // select a random position from the deck
    const randomIndex = getRandomIndex(cards.length);

    // get the current card in the loop
    const currentItem = cards[currentIndex];

    // get the random card
    const randomItem = cards[randomIndex];

    // swap the current card and the random card
    cards[currentIndex] = randomItem;
    cards[randomIndex] = currentItem;

    currentIndex += 1;
  }

  // give back the shuffled deck
  return cards;
};

const makeDeck = function () {
  // create the empty deck at the beginning
  const deck = [];

  const suits = ['red', 'yellow', 'blue', 'green'];

  let suitIndex = 0;
  while (suitIndex < suits.length) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];

    // loop to create all cards in this suit
    // rank 1-13
    let rankCounter = 0;
    while (rankCounter <= 9) {
      const cardName = rankCounter;

      // 1, 11, 12 ,13
      // if (cardName === 1) {
      //   cardName = 'ace';
      // } else if (cardName === 11) {
      //   cardName = 'jack';
      // } else if (cardName === 12) {
      //   cardName = 'queen';
      // } else if (cardName === 13) {
      //   cardName = 'king';
      // }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // add the card to the deck
      deck.push(card);

      rankCounter += 1;
    }
    suitIndex += 1;
  }

  return deck;
};

export default function initGameController(db) {
  const create = async (req, res) => {
    try {
      const { currentPlayer } = req.body;
      console.log(currentPlayer);
      let game = await db.Game.findAll();
      console.log('game in teh DB =====');
      console.log(game);
      if (game.length === 0) {
        const cardDeck = shuffleCards(makeDeck());
        // const player1Hand = [cardDeck.pop(), cardDeck.pop(), cardDeck.pop(), cardDeck.pop(), cardDeck.pop(), cardDeck.pop(), cardDeck.pop()];
        const player1Hand = [cardDeck.pop(), cardDeck.pop()];
        const newGame = {
          gameState: {
            cardDeck,
            player1Cards: player1Hand,
            // currentPlayer: player1Hand,
          },
        };
        const createdGame = await db.Game.create(newGame);
        console.log(createdGame);
        game = createdGame;
      } else {
        console.log('a game exists in the db');
        console.log('new game value when the player exists');
        game = game[0];
        console.log(game);
        // deal card to the second player:
        const existingGameId = game.id;
        console.log(`RXISTING GAME ID IS: ${existingGameId}`);
        // const secondPlayerHand = game.gameState.cardDeck.pop();
        const secondPlayerHand = [];
        // draw the cards for second player.
        for (let i = 0; i < 2; i += 1) {
          const drawnCard = game.gameState.cardDeck.pop();
          secondPlayerHand.push(drawnCard);
        }
        console.log('SECOND PLAYERS HAND:');
        console.log(secondPlayerHand);
        game.gameState.player2Cards = secondPlayerHand;
        console.log('CHECK FOR GAME STATE');
        console.log(game.gameState);
        await game.save();
        console.log(game);
        console.log('TRYING TO SAVE 2ND PLAYERs hand IN DB');
        console.log('CHECK PREVIOUS CARD DECK VALUE.....');
        console.log(game.gameState.cardDeck);
        const updatedGameState = {
          cardDeck: game.gameState.cardDeck,
          player1Cards: game.gameState.player1Cards,
          player2Cards: secondPlayerHand,
          // currentPlayer: game.gameState.player1Cards,
          // player2Cards: secondPlayerHand,
        };
        const addHand = await db.Game.update({ gameState: updatedGameState }, { where: { id: existingGameId } });
        console.log('CONSOLE LOG FOR ADD HAND');
        console.log(addHand);
      }

      try {
        const player = await db.Player.findAll({
          where: {
            name: currentPlayer,
          },
        });
        console.log('player is:');
        console.log(player);
        console.log('game is:');
        console.log(game);
        game.addPlayer(player);
      } catch (err) {
        console.log(err);
      }

      //
    } catch (err) {
      console.log(err);
    }
    res.send('successfully created game and associated the user');
  };

  /**
   * query the database to get the game and player's information.
   */
  const show = async (req, res) => {
    const gameData = await db.Game.findAll();
    console.log(gameData);
    console.log('sending game data to the browser');
    const currentPlayer = req.cookies.playerName;
    console.log(currentPlayer);
    // experiment
    const playerInfo = await gameData[0].getPlayers();
    console.log('PLAYER INFO');
    console.log(playerInfo[0].id);
    // const playerId = playerInfo[0].id;
    const playerName = playerInfo[0].name;
    // console.log('another player id');
    // console.log(playerInfo[1].id);

    // comapre the game's player Id and the cookies
    if (playerName == currentPlayer) {
      // res.send(gameData[0].gameState.player1Cards);
      res.send([gameData[0].gameState.player1Cards, 'firstPlayer']);
    } else if (playerInfo[1].name == currentPlayer) {
      // res.send(gameData[0].gameState.player2Cards);
      res.send([gameData[0].gameState.player2Cards, 'secondPlayer']);
    } else {
      res.send('oopps something went wrong');
    }
    // /
  };
  return {
    create,
    show,
  };
}
