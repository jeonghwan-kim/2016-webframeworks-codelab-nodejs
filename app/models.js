const Sequelize = require('sequelize');
const config = require('./config/environment')
const sequelize = new Sequelize(
    config.mysql.database,
    config.mysql.username,
    config.mysql.password, {
      logging: config.mysql.logging
    });

const User = sequelize.define('user', {
  name: Sequelize.STRING
});

module.exports = {
  sequelize: sequelize,
  User: User
}
