const ProductModel = require("../models/product.model.js");


class ProductManager {

    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {

            if(!title || !description || !price || !code || !stock || !category ) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            //Acá tenemos que cambiar la validacion: 
            const existingProduct = await ProductModel.findOne({ code: code });

            if (existingProduct) {
                console.log("El código debe ser único");
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();

        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const products = await ProductModel.find();
            return products;
        } catch (error) {
            console.log("Error al obtener los productos", error);
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);

            if (!product) {
                console.log("Producto no encontrado");
                return null;
            }

            console.log("Producto encontrado");
            return product;
        } catch (error) {
            console.log("Error al traer un producto por id");
        }
    }

    async updateProduct(id, updatedProduct) {
        try {

            const productUpdated = await ProductModel.findByIdAndUpdate(id, updatedProduct);

            if (!productUpdated) {
                console.log("Producto no encontrado");
                return null;
            }

            console.log("Producto actualizado con exito");
            return productUpdated;
        } catch (error) {
            console.log("Error al actualizar el producto", error);

        }
    }

    async deleteProduct(id) {
        try {

            const deleted = await ProductModel.findByIdAndDelete(id);

            if (!deleted) {
                console.log("Producto no encuentrado");
                return null;
            }

            console.log("Producto eliminado");
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

module.exports = ProductManager; 