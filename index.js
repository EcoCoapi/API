const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config()
const mg = require('mailgun-js')
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const mysql = require('mysql');
const sgMail = require('@sendgrid/mail');
const { error } = require('console'); 

const key = process.env["SENDGRID_API_KEY"]

sgMail.setApiKey(key)
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

//Create un compte dans la bdd

app.post("/comptes/add", (req, res) => {

    const {
        nom, 
        prenom,
        mail, 
        mdp, 
        idEcole
    } = req.body

    con.query(
        `INSERT INTO Comptes (mail, motDePasse, nom, prenom, id_ecole, id_classe) VALUES ('${mail}', '${mdp}', '${nom}','${prenom}', '${idEcole}', '${1}');`,
        function(error, result) {
            if(error) console.log(error)
            else {
                console.log(result)
                res.send("Comptes ajoutés à la base")
            }
        }
    )
})

//Read un compte dans la bdd

app.get("/comptes/:mail", (req, res) => {

    const mail = req.params.mail
    console.log(req.params.mail)

    con.query(
        `SELECT * FROM Comptes WHERE mail = '${mail}';`, 
        function(error, result) {
            if(error)console.log(error)
            else {
                console.log(result)
                res.send(result)
            }
        }
    )
})

//Update à jour un compte dans la bdddfe

app.put('/comptes', (req, res) => {

    const {mail, nom, prenom, mdp} = req.body

    con.query(
        `UPDATE Comptes SET nom = '${nom}', prenom = '${prenom}', motDePasse = '${mdp}' WHERE (mail = '${mail}');`,
        function(error, result) {
            if(error)console.log(error)
            else {
                console.log(result)
                res.send("Compte mis à jour dans la base")
            }
        }
    )
})
 
//Delete un compte dans la bdd

app.delete("/comptes", (req, res) => {
    
    const {mail} = req.body
    
    con.query(
        `DELETE FROM Comptes WHERE mail = '${mail}');`, 
        function(error, result){
            if(error) console.log(error)
            else {
                console.log(result)
                res.send("Compte supprimé de la base")
            }
        }
        


    )

})

//Create une école 

app.post("/ecole", (req, res) => {

    const {
        nom, 
        ville, 
        departement,
        region, 
        nbClasse, 
        nbBus, 
        nbPisteCylclable, 
        nbStationVelo,
        type
    } = req.body

    con.query(
        `INSERT INTO Ecoles (nom, ville, departement, region, nbClasse, nbBus, nbPistecCyclable, nbStationVelo, type) VALUES ('${nom}', '${ville}', '${departement}', '${region}', '${nbClasse}', '${nbBus}', '${nbPisteCylclable}', '${nbStationVelo}', '${type}');`,
        function(error, result){
            if(error)console.log(error)
            else {                console.log(result)
                res.send("Ecole bien ajouté à la base")
            }
        }   
    )

})

//Read une école

app.get("/ecole/:id", (req, res) => {

    const id = req.params.id
    console.log(req.params.mail)

    con.query(
        `SELECT * FROM Ecoles WHERE idEcole = '${id}';`, 
        function(error, result) {
            if(error)console.log(error)
            else {
                console.log(result)
                res.send(result)
            }
        }
    )

    

})

// Read toutes les écoles

app.get("/ecole", (req, res) => {

    con.query(
        `SELECT * FROM Ecoles;`, 
        function(error, result) {
            if(error)console.log(error)
            else {
                console.log(result)
                res.send(result)
            }
        }
    )

    

})

//Update une école

//Delete une école


//Create une classe

app.post("/classe", (req, res) => {

    const {
        idEcole, 
        niveau, 
        nbEleve, 
        mailProf, 

    } = req.body
        
    con.query(
        `INSERT INTO Classes (idEcole, niveau, nbEleves, mailProf) VALUES ('${idEcole}', '${niveau}', '${nbEleve}', '${mailProf}');`, 
        function(error, result){
            if(error) console.log(error)
            else {
                console.log(result)
                res.send("Classe bien ajotuté à la base")
            }
        }
    )
    

    



})

// Read 1 classe

app.get("/classe/:id", (req, res) => {

    const id = req.params.id

    con.query(
        `SELECT * FROM Classes WHERE idClasse = '${id}';`, 
        function(error, result) {
            if(error)console.log(error)
            else {
                console.log(result)
                res.send(result)
            }
        }
    )

    

})

//Read toute les classe

app.get("/classe", (req, res) => {

    con.query(
        "SELECT * FROM Classes;", 
        function(error, result) {
            if(error)console.log(error)
            else {
                console.log(result)
                res.send(result)
            }
        }
    )

})
//Read toute les classe d'un prof

app.get("/classe/:mail", (req, res) => {

    const mail = req.params.mail

    con.query(
        `SELECT * FROM Classes WHERE mailProf = '${mail}';`, 
        function(error, result) {
            if(error)console.log(error)
            else {
                console.log(result)
                res.send(result)
            }
        }
    )

})

// envoi du mail de verif



app.post("/sendMailVerif", (req, res) => {
        
    const verifCode = Math.random().toString().slice(-6)

    /*
    mailgun()
        .messages()
        .send(
            {
                from : "ecocoapi@gmail.com", 
                to : req.body.mail, 
                subject: 'Sending with SendGrid is Fun',
                text: `Your verif code : ${verifCode}`,
                html: `<strong>Your verif code : ${verifCode}</strong>`,
            }, 
            (error, body) =>  {
                if(error) {
                    console.log(error)
                    res.send({message : "Error in send mail"})
                }else {
                    console.error(body)
                    res.send(verifCode)
                }

            }
        )
        
        */
    const msg = {
        to: req.body.mail, // Change to your recipient
        from: 'ecocoapi@gmail.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: `Your verif code : ${verifCode}`,
        html: `<strong>Your verif code : ${verifCode}</strong>`,
        }
    
        sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
            res.send(verifCode)
        })
        .catch((error) => {
            console.error(error)
        })

    
})

app.listen(port, () => {
  console.log(`Key : ${key}`);
});