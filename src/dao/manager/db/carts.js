import cartModel from "../../models/cart.js"

export default class CartsManager{
    
    constructor(){
    }

    getCarts = () =>{
        return cartModel.find().lean()
    }

    getCart = (id) =>{
        return cartModel.findById(id)
        .populate("type.product", "_id title description price stock")
        .lean()
    }

    createCart = (products = []) =>{
        return cartModel.create({ type: products })
    }

    updateCart = (id, cart) =>{
        return cartModel.findByIdAndUpdate(id, {type: cart})
    }

    deleteCart = (id) =>{
        return cartModel.findByIdAndDelete(id)
    }

    addProductToCart = (ids, quantity) =>{
        cartModel.findById(ids.cid)
        .then(cart => {
            cart.type.push({product: ids.pid, quantity})
            return cart.save()
        })
    }

    deleteProduct = (ids) =>{
        cartModel.findById(ids.cid)
        .then(cart => {
            const productIndex = cart.type.findIndex(product => product === ids.pid)
            cart.type.splice(productIndex, 1)
            return cart.save()
        })
    }

    updateProductQuantity = (ids, quantity) =>{
        return cartModel.findOneAndUpdate(
            { _id: ids.cid, "type.product": ids.pid },
            { $set: { "type.$.quantity": quantity } },
            { new: true }
    )}

    deleteProducts = (id) =>{
        return cartModel.findByIdAndUpdate(id, { type: [] })
    }

    purchase = async (id) => {
        return cartModel.findById(id).populate("type.product", "_id title description price stock")
            .then(async cart => {
                let totalAmount = 0
                const promises = []

                cart.type.forEach(item => {
                    if (item.product.stock < item.quantity) {
                        console.log(`Insufficient quantity for product: ${item.product.title}`)
                    } else {
                        item.product.stock -= item.quantity
                        totalAmount += item.product.price * item.quantity
                        promises.push(item.product.save())
                    }
                })
                await Promise.all(promises)
                await cart.save()
                return totalAmount
            })
            .catch(error => {
                console.error('Error fetching or updating cart:', error)
                throw error
            })
    }
}