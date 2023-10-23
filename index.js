const express = require('express');
const app = express();
const port = 8080;

user = process.env("MYSQL_ADDON_DB");

app.get('/', (req, res) => {
  res.send(user);
});

app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});