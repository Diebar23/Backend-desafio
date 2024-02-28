//Acá hacemos la conexión con MONGODB

//Instalar mongoose: npm i mongoose

const mongoose = require("mongoose");

mongoose.connect("tubd")
    .then(() => console.log("Conexión exitosa"))
    .catch(() => console.log("Error de conexión"))
    