const app = require('../app');
const port = 3000;
const syncDatabase = require('./sync-db');

app.listen(port, () => {
  console.log('Example app listening on port 3000!');

  syncDatabase().then(() => {
    console.log('Database sync');
  })
});
