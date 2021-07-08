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
  /**
   * create a game in the db and associate with the player.
   * If the game already exists, assign the player to the current game
   * @param req: request obj contains current player information.
   * @param res: send successful assignment message.
   */
  const create = async (req, res) => {
    try {
      const { currentPlayer } = req.body;
      let game = await db.Game.findAll();
      console.log('game in the DB =====');
      console.log(game);
      if (game.length === 0) {
        const cardDeck = shuffleCards(makeDeck());
        const player1Hand = [cardDeck.pop(), cardDeck.pop(), cardDeck.pop(), cardDeck.pop(), cardDeck.pop()];
        const newGame = {
          gameState: {
            cardDeck,
            player1Cards: player1Hand,
          },
        };
        const createdGame = await db.Game.create(newGame);
        game = createdGame;
      } else {
        game = game[0];
        const existingGameId = game.id;
        const secondPlayerHand = [];
        for (let i = 0; i < 5; i += 1) {
          const drawnCard = game.gameState.cardDeck.pop();
          secondPlayerHand.push(drawnCard);
        }
        game.gameState.player2Cards = secondPlayerHand;
        await game.save();
        const updatedGameState = {
          cardDeck: game.gameState.cardDeck,
          player1Cards: game.gameState.player1Cards,
          player2Cards: secondPlayerHand,
        };
        const addHand = await db.Game.update({ gameState: updatedGameState }, { where: { id: existingGameId } });
      }
      try {
        const player = await db.Player.findAll({
          where: {
            name: currentPlayer,
          },
        });
        game.addPlayer(player);
      } catch (err) {
        console.log(err);
      }
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
    const currentPlayer = req.cookies.playerName;
    const playerInfo = await gameData[0].getPlayers();
    const playerName = playerInfo[0].name;
    if (playerName == currentPlayer) {
      res.send([gameData[0].gameState.player1Cards, 'firstPlayer']);
    } else if (playerInfo[1].name == currentPlayer) {
      res.send([gameData[0].gameState.player2Cards, 'secondPlayer']);
    } else {
      res.send('oopps something went wrong');
    }
  };
  return {
    create,
    show,
  };
}
