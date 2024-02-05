const CartModel = require("../models/cart.model.js");

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({products: []});
            await newCart.save(); 
            return newCart; 
        } catch (error) {
            console.log("Error al crear carrito");
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
                if(!cart) {
                    console.log("No existe carrito con ese id");
                    return null;
                }

            return cart;
        } catch (error) {
            console.log("Error al buscar carrito", error);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId); 
            const existingProduct = cart.products.find(item => item.product.toString() === productId);

            if(existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({product: productId, quantity});
            }

            //Marcar "products" como modificada antes de guardar: 
            cart.markModified("products");

            await cart.save();
            return cart;
            
        } catch (error) {
            console.log("error al agregar producto", error);
        }
    }

}

module.exports = CartManager; 