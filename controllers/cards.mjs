export default function initCardController(db) {
  const show = async (req, res) => {
    const deckCards = await db.Game.findAll();
    const gameId = deckCards[0].id;
    console.log('all cards in the card deck :');
    console.log(deckCards[0].gameState.cardDeck);
    console.log('poped card is :');
    const popedCard = deckCards[0].gameState.cardDeck.pop();
    console.log(popedCard);
    const cardDeckLen = (deckCards[0].gameState.cardDeck).length;
    console.log(`card length is ${cardDeckLen}`);
    const updatedCardDeck = (deckCards[0].gameState.cardDeck).slice(0, cardDeckLen);
    console.log('updated card deck after slice');
    console.log(updatedCardDeck);

    //
    const updatedGameState = {
      cardDeck: updatedCardDeck,
      player1Cards: deckCards[0].gameState.player1Cards,
      player2Cards: deckCards[0].gameState.player2Cards,
      // currentPlayer: game.gameState.player1Cards,
      // player2Cards: secondPlayerHand,
    };
    try {
      await db.Game.update({ gameState: updatedGameState }, { where: { id: gameId } });
    } catch (err) {
      console.log(err);
    }

    //
    const { suit, rank } = popedCard;
    res.cookie('suit', suit);
    res.cookie('rank', rank);
    // res.send(deckCards[0].gameState.cardDeck.pop());
    res.send(popedCard);
  };

  const deleteCard = async (req, res) => {
    console.log('entered delete rourte');
    const { rank, suit } = req.deleteObj;
    const allCards = await db.game.findAll();
    console.log(allCards);
    res.send('received delete req');
  };
  return {
    show,
    deleteCard,
  };
}
