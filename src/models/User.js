const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstNeme :{
        type : String,
        required : true,
        trim : true,
    },

    lastName : {
        type : String,
        require : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
    },
    password: {
        type: String,
        required : true
    },
    role : {
        type : String,
        enum : ["ADMIN", "CHAUFEUR"],
        default : "CHAUFFEUR"
    },
    isActive : {
        type : Boolean,
        default : true
    }
},
{
    timestamps : true
})

module.exports = mongoose.model("User", userSchema)