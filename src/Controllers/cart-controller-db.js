import CartModel from "../dao/models/cart.model.js";


class CartController {
    async getCarts(req, res) {
        try {
            const carts = await CartModel.find();
            responce(res, 200, carts);
        } catch (error) {
            responce(res, 500, "Error al obtener los carritos");
        }
    }

    async postCart(req, res) {
        try {
            const newCart = req.body; 
            await ProductModel.create(nuevoJuguete);
            responce(res, 201, "Carriot creado exitosamente");
        } catch (error) {
            responce(res, 500, "Error al obtener los Carritos");
        }
    }
}

export default CartController;