const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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

app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({error: 'Incorrect id'});

  let user = users.filter(user => user.id === id)[0]
  if (!user) return res.status(404).json({error: 'Unknown user'});

  return res.json(user);
});

app.get('/users', (req, res) => {
  res.json(users)
});

app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({error: 'Incorrect id'});

  const userIdx = users.findIndex(user => user.id === id);
  if (userIdx === -1) {
    return res.status(404).json({error: 'Unknown user'});
  }

  users.splice(userIdx, 1);
  res.status(204).send();
});

app.post('/users', (req, res) => {
  const name = req.body.name || '';
  if (!name.length) {
    return res.status(400).json({error: 'Incorrenct name'});
  }

  const id = users.reduce((maxId, user) => {
    return user.id > maxId ? user.id : maxId
  }, 0) + 1;

  const newUser = {
    id: id,
    name: name
  };

  users.push(newUser);

  return res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({error: 'Incorrect id'});

  const name = req.body.name || '';
  if (!name.length) {
    return res.status(400).json({error: 'Incorrenct name'});
  }

  let user = users.filter(user => user.id === id)[0];
  if (!user) {
    return res.status(404).json({error: 'Unknown user'});
  }

  user.name = name;
  return res.json(user);
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
