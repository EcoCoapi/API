const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('Bonjour, test !');
});

app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});