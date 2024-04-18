const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");
const cartController = new CartController(); 
const authMiddleware = require("../middleware/authmiddleware.js");

router.use(authMiddleware);

router.post("/", cartController.newCart);
router.get("/:cid", cartController.getProductsFromCart);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.delete('/:cid/product/:pid', cartController.deleteProductFromCart);
router.put('/:cid', cartController.updateProductsInCart );
router.put('/:cid/product/:pid', cartController.updateQuantity);
router.delete('/:cid', cartController.emptyCart);
router.post('/:cid/purchase', cartController.finishPurchase);

module.exports = router;