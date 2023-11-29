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

/* ------------------------------------------------------------------------- DOCUMENT ---------------------------------------------------------- */

//GET tout les documents

app.get("/documents", (req, res) => {
    con.query('SELECT * FROM Documents', function(error, rows, fields) {
        if(error) console.log(error)

        else {
            res.send(rows)
        }
    })
})

/* ------------------------------------------------------------------------- Compte ---------------------------------------------------------- */
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

//Update un compte dans la bdddfe

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

/* ------------------------------------------------------------------------- ECOLE ---------------------------------------------------------- */

/*
idEcole int AI PK 
nom varchar(150) 
ville varchar(150) 
departement varchar(5) 
region varchar(50) 
nbClasse int 
nbBus int 
nbPistecCyclable int 
nbStationVelo int 
type int
*/

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

app.put("/ecole/:id", (req, res) => {

    const id = req.params.id

    const {nom, ville, departement, region, nbBus, nbPisteCyclable, nbStationVelo, type} = req.body

    con.query(
        `UPDATE Ecoles SET nom = '${nom}', ville= '${ville}', departement = '${departement}', region = '${region}', nbBus = '${nbBus}', nbPistecCyclable = '${nbPisteCyclable}', nbStationVelo = '${nbStationVelo}', type = '${type}' WHERE ( idEcole = '${id}');`, 
        function(error, result){
            if(error)console.log(error)
            else {
                console.log(result)
                res.send("Ecole mis à jour dans la base")

            }
        }
    )


})

//Delete une école

app.post("/ecole/:id", (req, res) => {

    const id = req.params.id

    con.query(
        `DELETE FROM Ecoles WHERE ( idEcole = '${id}');`,
        function(error, result){
            if(error) console.log(error)
            else {
                console.log(result)
                res.send("Ecole supprimé de la base")
            }
        }

    )




    
})

/* ------------------------------------------------------------------------- CLASSE ---------------------------------------------------------- */


/*
idClasse int AI PK 
idEcole int 
niveau varchar(10) 
nbEleves int 
mailProf varchar(150) 
idChallenge longtext 
*/

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

app.post("/classe/prof", (req, res) => {

    const {mail} = req.body
    console.log(req.body)

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
//Read toute les classe d'une école

app.post("/classe/ecole", (req, res) => {

    const {ecole} = req.body
    console.log(req.body)

    con.query(
        `SELECT * FROM Classes WHERE idEcole = '${ecole}';`, 
        function(error, result) {
            if(error)console.log(error)
            else {
                console.log(result)
                res.send(result)
            }
        }
    )

})

//Update une classe
app.put("/classe/:id", (req, res) => {

    const id = req.params.id

    const {niveau, nbEleves} = req.body


    con.query(
        `UPDATE Classes SET niveau = '${niveau}', nbEleves = '${nbEleves}' WHERE (idClasse = '${id}');`, 
        function(error, result) {
            if(error)console.log(error)
            else {
                console.log(result)
                res.send("Classe modifié dans la base")
            }
        }
    )


})

//Delete une classe
app.post('/classe/:id', (req, res) => {

    const id = req.params.id

    con.query(
        `DELETE FROM Classes WHERE idClasse = '${id}';`, 
        function(error, result) {
            if(error)console.log(error)
            else {
                console.log(result)
                res.send("Classe supprimés de la base !")
            }
        }
    )


})

//Add Challenge à une classe 
app.put("/classe/challenge/add/:id", (req, res) => {

    const idClasse = req.params.id

    const {idChallenge, listeClasse} = req.body

    let s = listeChallenge + `${idChallenge}|`

    con.query(
        `UPDATE Classes SET idChallenge = '${s}' WHERE (idClasse = '${idClasse}');`, 
        function(error, result) {
            if(error)console.log(error)
            else {
                console.log(result)
                res.send("Challenge ajouté à la classe")
            }
        }
    )


})

//Remove Challenge à une classe
app.put("/classe/challenge/remove/:id", (req, res) => {

    const idClasse = req.params.id

    const {idChallenge, listeChallenge} = req.body

    let s = listeChallenge.replace(`${idChallenge}|`, "")

    con.query(
        `UPDATE Classes SET idChallenge = '${s}' WHERE (idClasse = '${idClasse}');`, 
        function(error, result) {
            if(error)console.log(error)
            else {
                console.log(result)
                res.send("Challenge supprimés à la classe")
            }
        }
    )


})

/* ------------------------------------------------------------------------- CHALLENGE ---------------------------------------------------------- */


// Read tout les challenes
/*
idChallenge int PK 
nom varchar(200) 
description longtext 
dateDebut date 
dateFin date 
region varchar(100) 
departement varchar(5) 
ville varchar(200)
*/

// Read tout les challenes
app.get('/challenges', (req, res) => {

    con.query(
        'SELECT * FROM Challenges;', 
        function(error, result){
            if(error) console.log(error)
            else {
                console.log(result)
                res.send(result)
            }
        }
    )


})

// Read 1 challenge
app.get('/challenges/:id', (req, res) => {

    const id = req.params.id

    con.query(
        `SELECT * FROM Challenges WHERE idChallenge = '${id}';`, 
        function(error, result){
            if(error) console.log(error)
            else {
                console.log(result)
                res.send(result)
            }
        }
    )


})

// Create 1 challenge
app.post('/challenges', (req, res) => {

    const {
        nom, 
        description, 
        dateDebut, 
        dateFin, 
        region,
        departement, 
        ville
    } = req.body
ilno
    con.query(
        `INSERT INTO Challenges (nom, description, dateDebut, dateFin, region, departement, ville) VALUES ('${nom}', '${description}', '${dateDebut}', '${dateFin}', '${region}', '${departement}', '${ville}');`, 
        function(error, result){
            if(error) console.log(error)
            else {
                console.log(result)
                res.send("Challenge ajouté à la base !")
            }
        }
    )


})

// Update 1 CHallenge
app.put('/challenges/:id', (req, res) => {

    const id = req.params.id

    const {
        nom, 
        description, 
        dateDebut, 
        dateFin, 
        region,
        departement, 
        ville
    } = req.body

    con.query(
        `UPDATE Challenges SET nom = '${nom}', description = '${description}', dateDebut = '${dateDebut}', dateFin = '${dateFin}', region = '${region}', departement = '${departement}', ville = '${ville}' WHERE (idChallenge = '${id}');`, 
        function(error, result){
            if(error) console.log(error)
            else {
                console.log(result)
                res.send("Challenge modifé à la base !")
            }
        }
    )



})

//Delete 1 challenge
app.post('/challenges/:id', (req, res) => {

    const id = req.params.id

    con.query(
        `DELETE FROM Challenges WHERE idChallenge = '${id}';`, 
        function(error, result){
            if(error) console.log(error)
            else {
                console.log(result)
                res.send("Challenge supprimés à la base !")
            }
        }
    )

})

/* ------------------------------------------------------------------------- Groupe---------------------------------------------------------- */

//Create Groupe

app.post("/groupe", (req, res) => {

    const {classe, nom, isPublic, motDePasse} = req.body

    con.query(
        `INSERT INTO Groupe (listeClasse, nom, isPublic, motDePasse) VALUES ('${classe}', '${nom}', '${isPublic}', '${motDePasse}');`, 
        function(error, result){
            if(error) console.log(error)
            else {
                console.log(result)
                res.send("Groupe ajouté à la base !")
            }
        }
    )


})

//Delete Groupe
app.post('/groupe/:id', (req, res) => {

    const id = req.params.id

    con.query(
        `DELETE FROM Groupe  WHERE idGroupe = '${id}';`, 
        function(error, result) {
            if(error)console.log(error)
            else {
                console.log(result)
                res.send("Groupe supprimés de la base !")
            }
        }
    )


})

//Update Info Groupe
app.put('/groupe/:id', (req, res) => {

    const id = req.params.id

    const {
        nom, 
        listeClasse,
        isPublic,
        motDePasse
    } = req.body

    con.query(
        `UPDATE Groupe SET nom = '${nom}', listeClasse = '${listeClasse}', isPublic = '${isPublic}', motDePasse = '${motDePasse}' WHERE (idGroupe = '${id}');`, 
        function(error, result){
            if(error) console.log(error)
            else {
                console.log(result)
                res.send("Groupe modifé à la base !")
            }
        }
    )



})


//Get 1 Groupe
app.get('/groupe/:id', (req, res) => {

    const id = req.params.id

    con.query(
        `SELECT * FROM Groupe WHERE idGroupe = '${id}';`, 
        function(error, result){
            if(error) console.log(error)
            else {
                console.log(result)
                res.send(result)
            }
        }
    )


})


//Get All groupe

app.get("/groupe", (req, res) => {

    con.query(
        `SELECT * FROM Groupe;`, 
        function(error, result){
            if(error) console.log(error)
            else {
                console.log(result)
                res.send(result)
            }
        }
    )

})
//Ajouter une classe a un groupe 
app.put("/groupe/classe/add/:id", (req, res) => {
    const idGroupe = req.params.id;
    const { idClasse, listeClasse } = req.body; // Correction: Utiliser listeClasse

    let s = listeClasse + `${idClasse}|`;

    con.query(
        `UPDATE Groupe SET listeClasse = '${s}' WHERE (idGroupe = '${idGroupe}');`,
        function (error, result) {
            if (error) console.log(error);
            else {
                console.log(result);
                res.send("Classe ajoutée au groupe"); // Correction: Utiliser "Classe" au lieu de "Classe "
            }
        }
    );
});



/* ------------------------------------------------------------------------- SEANCE CHALLENGE ---------------------------------------------------------- */

//Create 1 Seance


app.post("/seance", (req, res) => {

    const {idChallenge, idClasse, date,duree,points} = req.body

    con.query(
        `INSERT INTO Seances (idChallenge, idClasse, date,duree,points) VALUES ( '${idChallenge}', '${idClasse}', '${date}','${duree}','${points}');`, 
        function(error, result){
            if(error) console.log(error)
            else {
                console.log(result)
                res.send("Séance ajouté à la base !")
            }
        }
    )


})


//Read all seance for one classe and one challenge

//Update one seance

//Delete one seance

/* ------------------------------------------------------------------------- CHALLENGE ECO ---------------------------------------------------------- */

//Create 1 Challenge Eco

/* ------------------------------------------------------------------------- SEANCE CHALLENGE ECO ---------------------------------------------------------- */


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
