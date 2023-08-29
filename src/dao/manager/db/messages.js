import messageModel from "../../models/message.js"

export default class messageManager{

    getMessages = () =>{
        return messageModel.find().lean()
    }

    getMessage = (id) =>{
        return messageModel.findById(id)
    }
}