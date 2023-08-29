import { fileURLToPath } from "url"
import { dirname } from "path"
import bcrypt from "bcrypt"
import messageModel from "./dao/models/message.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password)

export const socket = () => {
  console.log("New client coneccted")
  socket.on("message", data => {
    const newMessage = new messageModel({
      user: data.user,
      message: data.message
    })
    newMessage.save()
      .then(() => messageModel.find())
      .then(messages => {
        io.emit("messageLogs", messages)
      })
  })
}

export default __dirname