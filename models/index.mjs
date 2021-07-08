import sequelizePackage from 'sequelize';
import allConfig from '../config/config.js';

import initPlayerModel from './player.mjs';
import initGameModel from './game.mjs';

const { Sequelize } = sequelizePackage;
const env = process.env.NODE_ENV || 'production';
// console.log()
// console.log(env);
const config = allConfig[env];
const db = {};
let sequelize;

if (env === 'PRODUCTION') {
  // Break apart the Heroku database url and rebuild the configs we need
  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
  const password = dbUrl.auth.substr(
    dbUrl.auth.indexOf(':') + 1,
    dbUrl.auth.length,
  );
  const dbName = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
  sequelize = new Sequelize(dbName, username, password, config);
}

// If env is not production, retrieve DB auth details from the config
else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

db.Player = initPlayerModel(sequelize, Sequelize.DataTypes);
db.Game = initGameModel(sequelize, Sequelize.DataTypes);

// in order for the many-to-many work, we must mention the join table here.
db.Player.belongsToMany(db.Game, { through: 'games_players' });
db.Game.belongsToMany(db.Player, { through: 'games_players' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

// new code
// import { Sequelize } from 'sequelize';
// import url from 'url';
// import allConfig from '../config/config.js';

// const env = process.env.NODE_ENV || 'development';
// const config = allConfig[env];
// const db = {};
// let sequelize;

// // If env is production, retrieve database auth details from the
// // DATABASE_URL env var that Heroku provides us
// if (env === 'PRODUCTION') {
//   // Break apart the Heroku database url and rebuild the configs we need
//   const { DATABASE_URL } = process.env;
//   const dbUrl = url.parse(DATABASE_URL);
//   const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
//   const password = dbUrl.auth.substr(
//     dbUrl.auth.indexOf(':') + 1,
//     dbUrl.auth.length
//   );
//   const dbName = dbUrl.path.slice(1);
//   const host = dbUrl.hostname;
//   const { port } = dbUrl;
//   config.host = host;
//   config.port = port;
//   sequelize = new Sequelize(dbName, username, password, config);
// }

// // If env is not production, retrieve DB auth details from the config
// else {
//   sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     config
//   );
// }

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// export default db;
