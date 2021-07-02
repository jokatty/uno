export default function initCardController(db) {
  const show = async (req, res) => {
    const deckCards = await db.Game.findAll();
    console.log(deckCards[0].gameState.cardDeck);
    res.send(deckCards[0].gameState.cardDeck.pop());
  };
  return {
    show,
  };
}
