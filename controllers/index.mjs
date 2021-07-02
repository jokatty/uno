export default function initIndexController(db) {
  const index = (request, response) => {
    // db.Item.findAll()
    //   .then((items) => {
    //     response.render('items/index', { items });
    //   })
    //   .catch((error) => console.log(error));
    response.render('index');
  };
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
