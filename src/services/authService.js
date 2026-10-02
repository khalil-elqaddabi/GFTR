const User = require("../models/User");
const bcrypt = require("bcrypt");
const { hashPassword } = require("../utils/password");


const register = async(firstName, lastName, email, password) => {
    const existingUser = await User.findOne({email})

    if (existingUser) {
        throw new Error("email allready exists")
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashPassword
    })
    return user;
}


const login =  async(email, password) => {
    
    const user = await User.findOne({email})

    if(!user) {
        throw new Error("invalid email or password")
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        throw new Error("invalid email or password")
    }
    return user
}

module.exports = {
    register,
    login
}