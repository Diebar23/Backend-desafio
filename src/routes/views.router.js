import express from "express";
const router = express.Router(); 
import ProductManager from "../controllers/product-controller-db.js";
import CartManager from "../controllers/cart-controller-db.js";
const productManager = new ProductManager();
const cartManager = new CartManager();


router.get("/products", async (req, res) => {
   try {
      const { page = 1, limit = 5 } = req.query;
      const products = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });

      const newArray = products.docs.map(product => {
         const { _id, ...rest } = product.toObject();
         return rest;
      });

      res.render("products", {
         products: newArray,
         hasPrevPage: products.hasPrevPage,
         hasNextPage: products.hasNextPage,
         prevPage: products.prevPage,
         nextPage: products.nextPage,
         currentPage: products.page,
         totalPages: products.totalPages
      });

   } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }
});

router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;

   try {
      const cart = await cartManager.getCartById(cartId);

      if (!cart) {
         console.log("No existe carrito con ese id");
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productsInCart = cart.products.map(item => ({
         product: item.product.toObject(), 
         quantity: item.quantity
      }));


      res.render("carts", { products: productsInCart });
   } catch (error) {
      console.error("Error al obtener carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
   }
});

// Ruta para el formulario de login

router.get("/login", (req, res) => {
   res.render("login");
});

// Ruta para el formulario de registro

router.get("/register", (req, res) => {
   res.render("register");
});

router.get("/", (req, res) => {
   res.render("main", {user:req.session.user})
})
// Ruta para la vista de perfil

// router.get("/profile", (req, res) => {
   
// if (!req.session.login) {
       
//     return res.redirect("/login");
//}

//    // res.render("profile", { user: req.session.user });
//    res.render("profile");
// });



export default router;