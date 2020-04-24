// Importar las dependencias para configurar el servidor
var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// configurar el puerto y el mensaje en caso de exito
app.listen((process.env.PORT || 3000), () => console.log('El servidor webhook esta escchando!'));
const APP_TOKEN = 'EAAQCGihuZAmgBAIoqgoaQS2AAh3sfBtRaptYF9AaTZC3CdqMhJbss7NzIPSoOjzoGmFFIBiuAAL8Twj2rR78dP3yAr8DxQV0aiyuZCDD91wP7uAQySLS5PAWXOiXF9TOUlV4CyPNlotkq6stmXrPWZBUsQfhroR8UsuFZCv9xPAZDZD'
// Ruta de la pagina index
app.get("/", function (req, res) {
    res.send("Se ha desplegado de manera exitosa el CMaquera ChatBot :D!!!");
});

// Facebook Webhook

// Usados para la verificacion
app.get("/webhook", function (req, res) {
    // Verificar la coincidendia del token
    if (req.query["hub.verify_token"] === 'lucas_tokens') {
        // Mensaje de exito y envio del token requerido
        console.log("webhook verificado!");
        res.status(200).send(req.query["hub.challenge"]);
    } else {
        // Mensaje de fallo
        console.error("La verificacion ha fallado, porque los tokens no coinciden");
        res.sendStatus(403);
    }
});

// Todos eventos de mesenger sera apturados por esta ruta
app.post("/webhook", function (req, res) {
    // Verificar si el vento proviene del pagina asociada
    if (req.body.object == "page") {
        // Si existe multiples entradas entraas
        req.body.entry.forEach(function(entry) {
            // Iterara todos lo eventos capturados
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    process_event(event);
                }
            });
        });
        res.sendStatus(200);
    }
});


// Funcion donde se procesara el evento
function process_event(event){
    // Capturamos los datos del que genera el evento y el mensaje 
    var senderID = event.sender.id;
    var message = event.message.text;
    console.log(senderID);
    console.log(message);
    evaluateMessage(senderID,message);


 
}
function evaluateMessage(recipientId,message){
    if(isContaint(message,'ayuda')){

    }else{
        finalMessage = 'solo se repetir las cosas:'+message;
    }
    sendMessageText(recipientId,finalMessage);

}

function sendMessageText(recipientId,message){
    var messageData = {
        recipient:{
            id :recipientId
        },
        message:{
            text:message
        }
    };
    callSendAPI(messageData);
}
function callSendAPI(messageData){
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token:APP_TOKEN},
        method :'POST',
        json:messageData
    },function(error,response,data){
        if(error){
            console.log("no es posible enviar mensaje");
        }else{
            console.log("el mensaje fue enviado");

        }

    });
}

function isContaint(sentence,word){
    return sentence.indexOf(word)>-1;

}


