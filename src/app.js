// //Importo el ProductManager

const ProductManager = require("./product-manager");
const express = require("express");

const PUERTO = 8080;

//Instancia de la clase ProductManager

const manager = new ProductManager('./src/productos.json');
//Creamos el server

const app = express();

app.get("/products", async(req, res) => {
    try{
        //Cargamos el array de productos
        const arrayProductos = await manager.leerArchivo();

        //Guardo el query

        let limit = parseInt(req.query.limit);

        if(limit) {
            const arrayConLimite = arrayProductos.slice(o, limit);
            return res.send(arrayConLimite);
        }

    } catch (error) {
        console.log(error);
        return res.send("Error al procesar la solicitud");
    }

})    

//Listen

app.listen(PUERTO, () => {

    console.log(`Escuchando en el http://localhost:${PUERTO}`);

})
