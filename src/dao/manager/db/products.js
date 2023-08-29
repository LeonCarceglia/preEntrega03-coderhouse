import productModel from "../../models/product.js"

export default class ProductsManager{

    constructor(){
    }

    getProducts = async (req, currentUrl) =>{
        const { limit = 10, page = 1, sort = "desc", query = null } = req
        const options = {
            limit,
            page,
            lean: true,
            sort: { price: sort }
        }
        let condition = {}
        if (query == "avaiable"){
            condition = { stock: { $gt: 0 } }
        }
        else if(query != undefined){
            condition = { category: query }
        }
        
        const result = await productModel.paginate(condition, options)
        let prevLink = null
        if (result.hasPrevPage) {
            prevLink = currentUrl.replace(`page=${page}`, `page=${result.prevPage}`)
        }
        result.prevLink = prevLink
        let nextLink = null
        if (result.hasNextPage) {
            nextLink = currentUrl.replace(`page=${page}`, `page=${result.nextPage}`)
        }
        result.nextLink = nextLink

        return result
    }

    getProduct = (id) =>{
        return productModel.findById(id)
    }

    createProduct = (product) =>{
        return productModel.create(product)
    }

    updateProduct = (id, product) =>{
        return productModel.findByIdAndUpdate(id, product)
    }

    deleteProduct = (id) =>{
        return productModel.findByIdAndDelete(id)
    }

    getProductsRender = async () =>{
        const result = await productModel.paginate({}, {lean: true})
        let prevLink = null
        if (result.hasPrevPage) {
            prevLink = currentUrl.replace(`page=${page}`, `page=${result.prevPage}`)
        }
        result.prevLink = prevLink
        let nextLink = null
        if (result.hasNextPage) {
            nextLink = currentUrl.replace(`page=${page}`, `page=${result.nextPage}`)
        }
        result.nextLink = nextLink

        return result
    }
}