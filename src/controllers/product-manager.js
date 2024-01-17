const fs = require("fs").promises;

class ProductManager {
    static ultId = 0;
    
    constructor(path) {
        this.products = [];
        this.path = path;
    }
    //Metodos
    async addProduct ({title, description, price, code, stock, category, thumbnails }) {
        try {
            const arrayProducts = await this.readFile();

        if(!title || !description || !price || !code || !stock || !category ) {
            console.log("Todos los campos deben estar completos");
            return;
        }
        
        if(arrayProducts.some(item => item.code === code)) {
            console.log("El codigo debe ser unico");
            return;
        }
   
        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            code,
            stock,
            status: true,
            category,
            thumbnails: thumbnails || []            
        };
        
        if (arrayProducts.length > 0) {
            ProductManager.ultId = arrayProductos.reduce((maxId, product) => Math.max(maxId, product.id), 0);
        }
        
        newProduct.id = ++ProductManager.ultId; 

        arrayProducts.push(newProduct);
        await this.saveFile(arrayProducts);
      } catch (error) {
        console.log("Error al agregar producto", error);
        throw error; 
      }
    }
    async getProducts() {
        try {
            const arrayProducts = this.readFile();
            return arrayProducts;
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const arrayProducts = await this.readFile();
            const found = arrayProducts.find(item => item.id === id);

            if(!found) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return found;
            }
        } catch (error) {
            console.log("Error al leer archivo", error);
            throw error;
        }      
    }

    async readFile() {
        try {
            const responce = await fs.readFile(this.path, "utf-8");
            const arrayProducts = JSON.parse(responce);
            return arrayProducts;
        }catch (error) {
            console.log("Error al leer archivo", error);
            throw error;
        }
    }

    async saveFile(arrayProducts){
        try{
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2))
        } catch (error) {
            console.log("Error al guardar archivo", error);
            throw error;
        }
    }
    //Se actualiza algun producto
    async updateProduct(id, productUpdated) {
        try {
            const arrayProducts = await this.readFile();

            const index = arrayProducts.findIndex(item => item.id === id);

            if(index !== -1) {
                arrayProducts[index] = { ...arrayProducts[index], ...updateProduct };
                await this.saveFile(arrayProducts);
                console.log("Producto actualizado");
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al actualizar producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProducts = await this.readFile();

            const index = arrayProducts.findIndex(item => item.id === id);

            if(index !== -1) {
                arrayProducts.splice(index, 1);
                await this.saveFile(arrayProducts);
                console.log("Producto eliminado")
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al eliminar producto", error);
            throw error;
        }
    }

}

module.exports = ProductManager;