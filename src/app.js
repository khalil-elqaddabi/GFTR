const express = require("express")
const errorHandler = require("./middlewares/errorHandler")
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");

const app = express()
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req , res) => {
    res.json({
        message : "fleet Management API is running"
    })
})
app.use(errorHandler)
app.use("/api/test", testRoutes);

module.exports = app