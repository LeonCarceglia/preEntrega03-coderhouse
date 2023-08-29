import ticketsModel from "../../models/ticket.js"

export default class TicketManager{
    constructor(){
    }

    createTicket = (amount, purchaser) =>{
        return ticketsModel.create({amount, purchaser})
    }

}