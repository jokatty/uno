export default function initIndexController(db) {
  // render the index page
  const index = (request, response) => {
    response.render('index');
  };
  /**
   * creates player in the players table
   * @param req: get the player data from response body.
   */
  const create = async (req, res) => {
    const playerName = req.body.player;
    try {
      const player = await db.Player.create({
        name: playerName,
      });
      // set the cookies
      console.log('set the cookies for the player');
      res.cookie('playerName', playerName);
      res.cookie('playerId', player.id);
    } catch (err) {
      if (err) {
        console.log(err);
      }
    }

    res.send('thank you!');
  };
  return {
    index,
    create,
  };
}
