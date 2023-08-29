import CustomRouter from "./router.js"
import passport from "passport"
import userController from "../controllers/users.controller.js"

export default class SessionRouter extends CustomRouter{
  init(){
    this.post(
      "/register",
      passport.authenticate("register", { failureRedirect: "/failureRedirect" }),
      userController.registerUser)

    this.post(
      "/login",
      passport.authenticate("login", { failureRedirect: "/failureRedirect" }),
      userController.loginUser)

    this.get("/github", passport.authenticate("github"), userController.github)

    this.get(
      "/githubcallback",
      passport.authenticate("github"),
      userController.githubCallback)
  }
}

