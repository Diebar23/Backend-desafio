// //Importo el ProductManager

const ProductManager = require("./product-manager");
const express = require("express");

const PUERTO = 8080;

//Instancia de la clase ProductManager

const manager = new ProductManager('./src/productos.json');
//Creo el server

const app = express();

app.get("/products", async(req, res) => {
    try{
        //Cargo el array de productos
        const arrayProductos = await manager.leerArchivo();

        //Guardo el query

        let limit = parseInt(req.query.limit);

        if(limit) {
            const arrayConLimite = arrayProductos.slice(0, limit);
            return res.send(arrayConLimite);
        }
        return res.send(arrayProductos);
        
    } catch (error) {
        console.log(error);
        return res.send("Error al procesar la solicitud");
    }

})    

app.get("/products/:pid", async(res, req) => {
    try{
        //Guardo el parametro
        let pid = parseInt(req.params.pid);

        //Lo busco
        const buscado = await manager.getProductById(pid);

        if(buscado) {
            return res.send(buscado);

        } else {
            return res.send("Id de producto no encontrado");
        }
    }catch(error) {
        console.log(error);
        res.send("Error en la busqueda");

    }

})

//Listen

app.listen(PUERTO, () => {

    console.log(`Escuchando en el http://localhost:${PUERTO}`);

})
