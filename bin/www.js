const app = require('../app');
const syncDatabase = require('./sync-db');

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');

  syncDatabase().then(() => {
    console.log('Database sync');
  });
});
