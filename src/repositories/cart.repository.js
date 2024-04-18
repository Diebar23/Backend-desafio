
const CartModel = require("../models/cart.model.js");

//Crear carrito nuevo

class CartRepository {

    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error("Error");
        }
    }

//Lista de los productos que pertenecen a los carritos

async getProductsFromCart(idCart) {
    try {
        const cart = await CartModel.findById(idCart);
        if (!cart) {
            console.log("No existe carrito con ese id");
            return null;
        }
        return cart;
    } catch (error) {
        throw new Error("Error");
    }
}

//Agregar productos a carritos

async addProduct(cartId, productId, quantity = 1) {
    try {
        const cart = await this.getProductsFromCart(cartId);
        const existingProduct = cart.products.find(item => item.product._id.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        //se marcar "products" como modificada antes de guardar: 

        cart.markModified("products");

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error("Error");
    }
}

//Eliminamos un producto del carrito

async deleteProduct(cartId, productId) {
    try {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        cart.products = cart.products.filter(item => item.product._id.toString() !== productId);
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error("Error");
    }
}

//Actualizar productos del carrito 

async updateProductsInCart(cartId, updatedProducts) {
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
        throw new Error("Error");
    }
}


//Actualizar las cantidades 

async updateProductQuantity(cartId, productId, newQuantity) {
    try {
        const cart = await CartModel.findById(cartId);

        if (!cart) {
            
            throw new Error('Carrito no encontrado');
        }
        
        
        const productIndex = cart.products.findIndex(item => item._id.toString() === productId);
    
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = newQuantity;


            cart.markModified('products');

            await cart.save();
            return cart;
        } else {
            throw new Error('Producto no encontrado en el carrito');
        }

    } catch (error) {
        throw new Error("Error al actualizar las cantidades");
    }
}


//Vaciar el carrito 

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
        throw new Error("Error");
    }
}
}

module.exports = CartRepository;