const express = require('express');
const app = express();
const port = 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mysql = require('mysql');

var con = mysql.createConnection({
    host : "bhwjlwblhuggr9xneide-mysql.services.clever-cloud.com",
    user : "urhdxtrur2oaayng",
    password : "xr5bVsmdPTl2athwykty",
    database : "bhwjlwblhuggr9xneide",
    port : 3306
});


app.get('/', (req, res) => {
  res.send("Bienvenur sur l'api");
});

//GET tout les documents

app.get("/documents", (req, res) => {
    con.query('SELECT * FROM Documents', function(error, rows, fields) {
        if(error) console.log(error)

        else {
            res.send(rows)
        }
    })
})


app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});