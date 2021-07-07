module.exports = {
  development: {
    username: 'jyotikattani',
    password: null,
    // Use "_development" suffix to indicate DB is for development purposes
    database: 'uno_development',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: 'jyotikattani',
    password: null,
    database: 'uno_production',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
};
