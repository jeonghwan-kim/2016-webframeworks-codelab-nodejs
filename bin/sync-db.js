const models = require('../app/models');

module.exports = () => {
  return models.sequelize.sync({force: true})
}
