const express = require("express"); 
const router = express.Router(); 
const CartManager = require("../controllers/cart-manager.js"); 
const cartManager = new CartManager("./src/models/carts.json"); 


//Crear carrito nuevo: 

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart(); 
        res.json(newCart)
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error); 
        res.status(500).json({error: "Error del servidor"});
    }
});

//Lista de los productos que pertenecen a los carritos

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        console.error("Error al obtener carrito", error);
        res.status(500).json({ error: "Error interno de servidor" });
    }
});


//Agregar productos a un carrito

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });   
    }
});

module.exports = router; 