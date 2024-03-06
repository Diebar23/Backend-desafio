//Acá hacemos la conexión con MONGODB

//Instalar mongoose: npm i mongoose

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://barbasdiego75:coderhouse@cluster0.wbn5cfo.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conexión exitosa"))
    .catch(() => console.log("Error de conexión"))
    