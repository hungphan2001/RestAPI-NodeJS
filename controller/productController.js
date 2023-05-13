const { default: slugify } = require("slugify");
const Product = require("../models/productModel");
const asyncHander = require("express-async-handler");
const createProduct = asyncHander(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct)
    } catch (error) {
        throw new Error(error);
    }
})

const updateProduct = asyncHander(async (req, res) => {
    const id = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
            new: true,
        });
        res.json(updateProduct)
    } catch (error) {
        throw new Error(error);
    }
})

const deleteProduct = asyncHander(async (req, res) => {
    const id = req.params;
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json("Deleted this Product");
})

const getAProduct = asyncHander(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
})

const getAllProduct = asyncHander(async (req, res) => {
    try {

        //Filtering
        const queryObj = { ...req.query };

        //Array
        const excludeFields = ["page", "sort", "limit", "fields"];

        //Filter use foreach and delete
        excludeFields.forEach((el) => delete queryObj[el]);
        console.log(queryObj);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = Product.find(JSON.parse(queryStr));

        //Sorting

        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);

        } else {
            query = query.sort("-createdAt");
        }

        //Limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        //pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip>=productCount) throw new Error('This page does not exist');
        }
        console.log(page, limit, skip);

        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
})
module.exports = { createProduct, getAProduct, getAllProduct, updateProduct, deleteProduct };