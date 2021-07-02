import sequelizePackage from 'sequelize';
import allConfig from '../config/config.js';

import initPlayerModel from './player.mjs';
import initGameModel from './game.mjs';

const { Sequelize } = sequelizePackage;
const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.Player = initPlayerModel(sequelize, Sequelize.DataTypes);
db.Game = initGameModel(sequelize, Sequelize.DataTypes);

// in order for the many-to-many work, we must mention the join table here.
db.Player.belongsToMany(db.Game, { through: 'games_players' });
db.Game.belongsToMany(db.Player, { through: 'games_players' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
