const { default: slugify } = require("slugify");
const Product = require("../models/productModel");
const asyncHander = require("express-async-handler");
const createProduct = asyncHander(async (req,res)=>{
  try{
    if(req.body.title){
        req.body.slug = slugify(req.body.title);
    }
   const newProduct = await Product.create(req.body);
   res.json(newProduct)
  }catch(error){
    throw new Error(error);
  }
})

const updateProduct = asyncHander(async(req,res)=>{
    const id =req.params;
    try { 
    if(req.body.title){
        req.body.slug=slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate({id},req.body,{
        new:true,
    });
    res.json(updateProduct)
    } catch (error) {
        throw new Error(error);
    }
})

const deleteProduct = asyncHander(async(req,res)=>{
    const id =req.params;
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json("Deleted this Product");
})

const getAProduct = asyncHander(async (req,res)=>{
    const {id}= req.params;
    try{
    const findProduct = await Product.findById(id);
    res.json(findProduct);
    }catch(error){
        throw new Error(error);
    }
})

const getAllProduct = asyncHander(async (req,res)=>{
    try {
        const getProduct = await Product.find();
        res.json(getProduct);
    } catch (error) {
        throw new Error(error);
    }
})
module.exports={createProduct,getAProduct,getAllProduct,updateProduct,deleteProduct};