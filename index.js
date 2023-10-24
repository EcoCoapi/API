const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config()
const mg = require('mailgun-js')
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const mailgun = () => mg({
    apiKey : "420964970bc230db2820cd806858f762-324e0bb2-467e2012",
    domain : "sandbox0ed549d4865d4ce08e23c3e5170ec2b2.mailgun.org"
})

const mysql = require('mysql');
const sgMail = require('@sendgrid/mail');
const { error } = require('console');
sgMail.setApiKey("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")
var con = mysql.createConnection({
    host : "bhwjlwblhuggr9xneide-mysql.services.clever-cloud.com",
    user : "urhdxtrur2oaayng",
    password : "xr5bVsmdPTl2athwykty",
    database : "bhwjlwblhuggr9xneide",
});


app.get('/', (req, res) => {
  res.send("Bienvenur sur l'");
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

// envoi du mail de verif



app.post("/sendMailVerif", (req, res) => {
        
    const verifCode = Math.random().toString().slice(-6)
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

})

app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});