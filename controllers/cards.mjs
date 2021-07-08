export default function initCardController(db) {
  /**
   * function queries the database. Pops out two cards from the Card deck object.
   * @param req
   * @param res: response params. sends back poped card data.
   */
  const show = async (req, res) => {
    const deckCards = await db.Game.findAll();
    const gameId = deckCards[0].id;
    const popedCard = deckCards[0].gameState.cardDeck.pop();
    const cardDeckLen = (deckCards[0].gameState.cardDeck).length;
    const updatedCardDeck = (deckCards[0].gameState.cardDeck).slice(0, cardDeckLen);
    const updatedGameState = {
      cardDeck: updatedCardDeck,
      player1Cards: deckCards[0].gameState.player1Cards,
      player2Cards: deckCards[0].gameState.player2Cards,
    };
    try {
      await db.Game.update({ gameState: updatedGameState }, { where: { id: gameId } });
    } catch (err) {
      console.log(err);
    }

    const { suit, rank } = popedCard;
    res.cookie('suit', suit);
    res.cookie('rank', rank);
    res.send(popedCard);
  };

  const deleteCard = async (req, res) => {
    const { rank, suit } = req.deleteObj;
    await db.game.findAll();
    res.send('received delete req');
  };
  return {
    show,
    deleteCard,
  };
}
