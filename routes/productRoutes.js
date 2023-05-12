const express =require("express");
const {createProduct,getAProduct,getAllProduct,updateProduct,deleteProduct} = require("../controller/productController")
const router = express.Router();
const {authMiddleware,isAdmin} = require("../middlewares/authMiddleware");

//Create a new product with access admin via token
router.post("/",authMiddleware,isAdmin,createProduct);

//Get a product
router.get("/:id",getAProduct);

//Update a product with access admin via token
router.put("/:id",authMiddleware,isAdmin,updateProduct);

//Delele a product with access admin via token
router.delete("/:id",authMiddleware,isAdmin,deleteProduct);

//Get all products
router.get("/",getAllProduct);

module.exports=router;