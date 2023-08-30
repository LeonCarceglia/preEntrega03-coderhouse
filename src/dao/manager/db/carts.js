import cartModel from "../../models/cart.js"

export default class CartsManager {

    constructor() {
    }

    getCarts = () => {
        return cartModel.find().lean()
    }

    getCart = (id) => {
        return cartModel.findById(id)
            .populate("type.product", "_id title description price stock")
            .lean()
    }

    createCart = (products = []) => {
        return cartModel.create({ type: products })
    }

    updateCart = (id, cart) => {
        return cartModel.findByIdAndUpdate(id, { type: cart })
    }

    deleteCart = (id) => {
        return cartModel.findByIdAndDelete(id)
    }

    addProductToCart = (ids, quantity) => {
        cartModel.findById(ids.cid)
            .then(cart => {
                const existingProduct = cart.type.find(item => item.product.equals(ids.pid))
                if (existingProduct) {
                    existingProduct.quantity += +quantity
                } else {
                    cart.type.push({ product: ids.pid, quantity })
                }
                return cart.save()
            })
    }

    deleteProduct = (ids) => {
        cartModel.findById(ids.cid)
            .then(cart => {
                const productIndex = cart.type.findIndex(product => product === ids.pid)
                cart.type.splice(productIndex, 1)
                return cart.save()
            })
    }

    updateProductQuantity = (ids, quantity) => {
        return cartModel.findOneAndUpdate(
            { _id: ids.cid, "type.product": ids.pid },
            { $set: { "type.$.quantity": quantity } },
            { new: true }
        )
    }

    deleteProducts = (id) => {
        return cartModel.findByIdAndUpdate(id, { type: [] })
    }

    purchase = async (id) => {
        try {
            const cart = await cartModel.findById(id).populate("type.product", "_id title description price stock")
            let totalAmount = 0
            const updatedType = cart.type.filter(item => {
                if (item.product.stock < item.quantity) {
                    console.log(`Insufficient quantity for product: ${item.product.title}`)
                    return false
                } else {
                    item.product.stock -= item.quantity
                    totalAmount += +item.product.price * item.quantity
                    return true
                }
            })
            cart.type = updatedType
            console.log(totalAmount)
            await cart.save()
            return totalAmount
        } catch (error) {
            console.error('Error fetching or updating cart:', error)
            throw error
        }
    }
}