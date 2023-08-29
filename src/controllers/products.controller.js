import { productService } from "../services/index.js"

const getProducts = async (req, res) => {
    const currentUrl = req.protocol + "://" + req.get("host") + req.originalUrl
    const products = await productService.getProducts(req.query, currentUrl)
    res.json({status: "success", data: products})
}

const getProduct = async (req, res) => {
    const {id} = req.params
    const product = await productService.getProduct(id)
    res.json({status: "ok", data: product})
}

const updateProduct = async (req, res) => {
    const {title, description, code, price, stock, category, thumbnails} = req.body
    if(!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({status: "error", message: "No data sent!"})
    }
    const {id} = req.params
    const newProduct = req.body
    const updatedProduct = await productService.updateProduct(id, newProduct)
    res.json({status: "ok", data: updatedProduct})
}

const createProduct = async (req,res) =>{
    const product = req.body
    const createdProduct = await productService.createProduct(product)
    res.status(201).json({status: "ok", data: createdProduct})
}

const deleteProduct = async (req,res) => {
    const {id} = req.params
    await productService.deleteProduct(id)
    res.sendStatus(204)
}

export default {
    getProducts,
    getProduct,
    updateProduct,
    createProduct,
    deleteProduct
}