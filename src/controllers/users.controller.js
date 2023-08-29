const registerUser = async (req, res) => {
    res.send({ status: "success", message: "User created" })
}

const loginUser = async (req, res) => {
    if (!req.user)
      return res.status(400).send({
        status: "failed",
        message: "User or password wrong",
      })
    req.session.user = req.user
    console.log(req.session.user)
    res.send({ status: "success", payload: req.user })
}

const githubCallback = async (req, res) => {
    req.session.user = req.user
    res.redirect("/products")
}

const github = async (req, res) => { }

export default {
    registerUser,
    loginUser,
    githubCallback,
    github
}