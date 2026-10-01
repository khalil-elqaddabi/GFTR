const mongoose = require("mongoose")


const camionSchema = new mongoose.Schema ({

    registrationNumber :{
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    brand : {
        type : String,
        required : true
    },
    model : {
        type : String,
        required : true
    },
    status : {
        type : String ,
        required : true ,
        enum : ["available", "maintenance", "active"],
        default : "available",
    },
    currentMileage : {
        type : Number,
        default : 0
    },

    isArchived : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
})

module.exports = mongoose.model("Camion", camionSchema)