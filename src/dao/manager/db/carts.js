import cartModel from "../../models/cart.js"
import mongoose from 'mongoose'

export default class CartsManager {

    constructor() {
    }

    getCarts = () => {
        return cartModel.find().lean()
    }

    getCart = (id) => {
        return cartModel.findById(id)
            .populate("products.product", "_id title description price stock")
            .lean()
    }

    createCart = (products = []) => {
        return cartModel.create({ products })
    }

    updateCart = (id, cart) => {
        return cartModel.findByIdAndUpdate(id, { products: cart })
    }

    deleteCart = (id) => {
        return cartModel.findByIdAndDelete(id)
    }

    addProductToCart = (ids, quantity) => {
        cartModel.findById(ids.cid)
            .then(cart => {
                const existingProductIndex = cart.products.findIndex(item => item.product._id == ids.pid)
                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity += +quantity
                } else {
                    cart.products.push({ product: ids.pid, quantity })
                }
                return cart.save()
            })
    }

    deleteProduct = (ids) => {
        cartModel.findById(ids.cid)
            .then(cart => {
                const productIndex = cart.products.findIndex(product => product === ids.pid)
                cart.products.splice(productIndex, 1)
                return cart.save()
            })
    }

    updateProductQuantity = (ids, quantity) => {
        return cartModel.findOneAndUpdate(
            { _id: ids.cid, "products.product": ids.pid },
            { $set: { "products.$.quantity": quantity } },
            { new: true }
        )
    }

    deleteProducts = (id) => {
        return cartModel.findByIdAndUpdate(id, { products: [] })
    }

    purchase = async (id) => {
        try {
            const cart = await cartModel.findById(id).populate("products.product", "_id title description price stock")
            let totalAmount = 0
            const unstockProducts = []
            for (const item of cart.products) {
                if (item.product.stock < item.quantity) {
                    console.log(`Insufficient quantity for product: ${item.product.title}`)
                    unstockProducts.push(item)
                } else {
                    item.product.stock -= item.quantity
                    totalAmount += +item.product.price * item.quantity
                }
            }
            await cartModel.findByIdAndUpdate(id, { products: unstockProducts })
            return totalAmount
        } catch (error) {
            console.error("Error in purchase", error)
            throw error
        }
    }
}