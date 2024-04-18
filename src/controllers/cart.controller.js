const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const TicketModel = require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateUniqueCode, calcularTotal } = require("../utils/cart.utils.js");


class CartController {
    async newCart(req, res) {
        try {
            const newCart = await cartRepository.createCart();
            res.json(newCart);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async getProductsFromCart(req, res) {
        const cartId = req.params.cid;
        try {
            const products = await cartRepository.getProductsFromCart(cartId);
            if (!products) {
                return res.status(404).json({ error: "Carrito no encontrado"})
            }
            res.json(products);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            await cartRepository.addProduct(cartId, productId, quantity);
            const cartID = (req.user.cart).toString();
            
            res.redirect(`/carts/${cartID}`)
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async deleteProductFromCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartRepository.deleteProduct(cartId, productId);
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito exitosamente',
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateProductsInCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        
        try {
            const updatedCart = await cartRepository.updateProductsInCart(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const updatedCart = await cartRepository.updateQuantityInCart(cartId, productId, newQuantity);

            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada exitosamente',
                updatedCart,
            });

        } catch (error) {
            res.status(500).send("Error al actualizar la cantidad de productos");
        }
    }

    async emptyCart(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartRepository.emptyCart(cartId);

            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados',
                updatedCart,
            });

        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async finishPurchase(req, res) {
        const cartId = req.params.cid;
        try {

            // Obtener el carrito y sus productos
            const cart = await cartRepository.getProductsFromCart(cartId);
            const products = cart.products;

            // Inicializar un array para almacenar los productos no disponibles
            const productsNotAvailable = [];

            // Verificar el stock y actualizar los productos disponibles
            for (const item of products) {
                const productId = item.product;
                const product = await productRepository.getProductById(productId);
                if (product.stock >= item.quantity) {

                    // Si hay stock, restar la cantidad del producto
                    product.stock -= item.quantity;
                    await product.save();
                } else {

                    // Si no hay stock, agregar el ID del producto al array de no disponibles
                    productsNotAvailable.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });

            // Crear un ticket de la compra
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();

            // Eliminar del carrito los productos que se compraron
            cart.products = cart.products.filter(item => productsNotAvailable.some(productId => productId.equals(item.product)));

            // Guardar el carrito actualizado en la base de datos
            await cart.save();

            res.status(200).json({ productsNotAvailable });
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

}

module.exports = CartController;