const express = require('express');
const bodyParser = require('body-parser');
const app = express();


// Database Mockup
let users = [
  {
    id: 1,
    name: 'chris',
  },
  {
    id: 2,
    name: 'tim',
  },
  {
    id: 3,
    name: 'daniel'
  }
]

app.get('/users', (req, res) => {
  res.json(users)
});


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
