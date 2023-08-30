import userModel from "../../models/user.js"

export default class UsersManager{
    constructor(){
    }

    getUsers = () =>{
        return userModel.find().lean()
    }

    getUser = (id) =>{
        return userModel.findById(id).lean()
    }

    createUser = (user) =>{
        return userModel.create(user)
    }

    updateUser = (id, user) =>{
        return userModel.findByIdAndUpdate(id, user)
    }

    deleteUser = (id) =>{
        return userModel.findByIdAndDelete(id)
    }

    existUser = (email) =>{
        return userModel.findOne({email})
    }
}