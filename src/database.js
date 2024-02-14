//Acá hacemos la conexión con MONGODB

//1) Instalar mongoose: npm i mongoose

const mongoose = require("mongoose");

//2) Nos conectamos a la BD: 

mongoose.connect("mongodb+srv://barbasdiego:cursocoder@cluster0.6f0lw9x.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() => console.log("Conexión exitosa"))
    .catch(() => console.log("Error de conexión"))
    