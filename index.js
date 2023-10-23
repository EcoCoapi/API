const express = require('express');
const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mysql = require('mysql');

var con = mysql.createConnection({
    host : "bhwjlwblhuggr9xneide-mysql.services.clever-cloud.com",
    user : "urhdxtrur2oaayng",
    password : "xr5bVsmdPTl2athwykty",
    database : "bhwjlwblhuggr9xneide",
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

//Post un compte dans la bdd

app.post("/comptes/add", (req, res) => {

    const {
        nom, 
        prenom,
        mail, 
        mdp, 
        idEcole
    } = req.body

    con.query(
        `INSERT INTO Comptes (mail, motDePasse, nom, prenom, id_ecole, id_classe) VALUES ('${mail}', '${mdp}', '${nom}','${prenom}', '${idEcole}', '');`,
        function(error, result) {
            if(error) console.log(error)
            else {
            console.log(result)
            res.send("Comptes ajoutés à la base")
        }
    }

    
    
    )

})


app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});