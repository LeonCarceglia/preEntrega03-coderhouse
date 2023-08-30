import {cartService} from "../services/index.js"
import {productService} from "../services/index.js"
import {userService} from "../services/index.js"


const getProductsRender = async (req, res) => {
    const user = userService.getCurrentUser(req.session.user)
    const products = await productService.getProductsRender()
    const productsRender = products.docs.map((item) => {
        return {
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category,
            stock: item.stock,
            _id: item._id,
            cart: user.cart
        }
    })
    res.render("products", { products: productsRender, user})
}

const getCart = async (req, res) => {
    const { cid } = req.params
    const cart = await cartService.getCart(cid)
    const cartRender = cart.type.map((item) => {
        return {
            product: item.product,
            quantity: item.quantity,
        }
    })
    res.render('carts', { cart: cartRender })
}

const register = (req, res) => {
    res.render('register')
}

const login = (req, res) => {
    res.render('login')
}

const current = (req, res) => {
    const user = userService.getCurrentUser(req.session.user)
    res.render('current', {user})
}

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
}

const chat = (req, res) =>{
    res.render("chat", {})
}

export default {
    getProductsRender,
    getCart,
    register,
    login,
    logout,
    current,
    chat
}