const express = require('express');

const server = express();

server.use(express.json());

const users = ['Samuel', 'Sofia', 'Edinho', 'Regiane'];

server.use( (req, res, next) => {
  console.log(`Método ${req.method} na rota ${req.url}`);
  next();
  console.log('Finalizou');
});

function checkUserExists(req, res, next){
  if(!req.body.name){
    return res.status(400).json({error: 'O nome é obrigatório'});
  }
  return next();
}

function checkUserInArray(req, res, next){
  const user = users[req.params.id];

  if(!user){
    return res.status(400).json({error: 'O usuário não existe'});
  }

  req.user = user;

  return next();
}

server.get('/users', (req, res) => {
  return res.status(200).json({'users': users});
});

server.get('/users/:id', checkUserInArray, (req, res) =>  {
  const id = req.params.id;

  return res.status(200).json({'user': req.user});
});

server.post('/users', checkUserExists, (req, res)  =>  {
  const { name }  = req.body;

  users.push(name);

  return res.status(201).json({"users": users});
});

server.put('/users/:id', checkUserInArray, checkUserExists,  (req, res)  =>  {
  const { id }  = req.params;
  const { name }  = req.body;
  users[id] = name;

  return res.status(200).json({'user': users[id]});
});

server.delete('/users/:id', checkUserInArray, (req, res) =>  {
  const { id }  = req.params;
  users.splice(id, 1);

  return res.send();
});

server.listen(3000);