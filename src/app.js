const express = require("express")
const errorHandler = require("./middlewares/errorHandler")

const app = express()
app.use(express.json());

app.get("/", (req , res) => {
    res.json({
        message : "fleet Management API is running"
    })
})
app.use(errorHandler)

module.exports = app