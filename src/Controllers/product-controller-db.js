import ProductModel from  "../dao/models/product.model.js";


class ProductController {
    async getProducts(req, res) {
        try {
            const products = await ProductModel.find();
            responce(res, 200, products);
        } catch (error) {
            responce(res, 500, "Error al obtener los productos");
        }
    }

    async postProduct(req, res) {
        try {
            const newProduct = req.body; 
            await ProductModel.create(nuevoJuguete);
            responce(res, 201, "Producto creado exitosamente");
        } catch (error) {
            responce(res, 500, "Error al obtener los productos");
        }
    }
}

export default ProductController;