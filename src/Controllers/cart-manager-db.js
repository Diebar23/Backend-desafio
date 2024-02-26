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

    async deleteProductCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }


            cart.products = cart.products.filter(item => item.product_id.toString() !== productId);

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito', error);
            throw error;
        }
    }

    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = updatedProducts;

            cart.markModified('products');

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito', error);
            throw error;
        }
    }

    async updateQuantityProduct(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(item => item.product_id.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;


                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto', error);
            throw error;
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito', error);
            throw error;
        }
    }

}

module.exports = CartManager; 