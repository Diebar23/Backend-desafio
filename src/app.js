const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");

const PUERTO = 8080;

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json()); 
app.use(express.static("./src/public"));

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Routing: 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//Listen
const server = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);

});

//Socket.io
//Crear una vista realTimeProducts.handlebars


//Obtener array de productos

const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

const io = socket(server);

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

     //Enviamos el array de productos al cliente que se conectó:
     socket.emit("products", await productManager.getProducts());    
    
     //Recibimos el evento "eliminarProducto" desde el cliente:
     socket.on("deleteProduct", async (id) => {
         await productManager.deleteProduct(id);

         //Enviamos el array de productos actualizado a todos los productos:
         io.sockets.emit("products", await productManager.getProducts());
     });

      //Recibimos el evento "agregarProducto" desde el cliente:
    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        //Enviamos el array de productos actualizado a todos los productos:
        io.sockets.emit("products", await productManager.getProducts());
    });
});