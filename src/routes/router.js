import { Router } from "express"

export default class CustomRouter {
    constructor() {
        this.this = Router()
        this.init()
    }

    getRouter() {
        return this.this
    }

    init() { } 

    get(path, policies, ...callbacks) {
        this.this.get(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }

    post(path, policies, ...callbacks) {
        this.this.post(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }

    put(path, policies, ...callbacks) {
        this.this.put(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }

    delete(path, policies, ...callbacks) {
        this.this.delete(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = (payload) =>
            res.status(200).send({ status: "success", payload })
        next()
    }

    handlePolicies = (policies) => {
        return (req, res, next) => {
            if (policies[0] === "PUBLIC") return next()
            if (!policies.includes(user.role.toUpperCase()))
            return res.status(403).send({ status: "error", error: "Forbidden" })
            req.user = user
            next()
        }
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                params[1].status(500).send(error)
            }
        })
    }
}
  