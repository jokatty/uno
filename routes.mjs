import db from './models/index.mjs';

// import the controller
import initIndexController from './controllers/index.mjs';
import initGameController from './controllers/games.mjs';
import initCardController from './controllers/cards.mjs';

export default function bindRoutes(app) {
  // pass in the db for all items callbacks
  const indexController = initIndexController(db);
  const gameController = initGameController(db);
  const cardController = initCardController(db);

  app.get('/', indexController.index);
  app.post('/', indexController.create);
  app.get('/game', gameController.show);
  app.post('/game', gameController.create);
  app.get('/cards', cardController.show);
  app.delete('/cards', cardController.deleteCard);
}
