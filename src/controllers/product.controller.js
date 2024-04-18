const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();


class ProductController {

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const result = await productRepository.addProduct(newProduct);
            res.json(result);

        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;

            const products = await productRepository.getProducts(limit, page, sort, query);

            res.json(products);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const wanted = await productRepository.getProductById(id);
            if (!wanted) {
                return res.json({
                    error: "Producto no encontrado"
                });
            }
            res.json(wanted);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const productUpdated = req.body;

            const resultado = await productRepository.updateProduct(id, productUpdated);
            res.json(result);
        } catch (error) {
            res.status(500).send("Error al actualizar producto");
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        try {
            let responce = await productRepository.deleteProduct(id);

            res.json(responce);
        } catch (error) {
            res.status(500).send("Error al eliminar producto");
        }
    }
}

module.exports = ProductController; 