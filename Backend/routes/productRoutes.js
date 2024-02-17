const express=require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview } = require("../controllers/productControllers");
//const { getMaxListeners } = require("../app");
const { isAuthenticatedUser,authorizedRoles } = require("../middleware/auth");
const router=express.Router();

router.route("/products").get(getAllProducts);


router.route("/admin/products/new").post(isAuthenticatedUser,authorizedRoles("admin"),createProduct);

router
.route("/admin/product/:id")
.put(isAuthenticatedUser,authorizedRoles("admin"),updateProduct)
.delete(isAuthenticatedUser,authorizedRoles("admin"),deleteProduct)
.get(isAuthenticatedUser,getProductDetails);

router. route("/product/:id").get(getProductDetails);

router. route("/review").put(isAuthenticatedUser,createProductReview);
module.exports=router;