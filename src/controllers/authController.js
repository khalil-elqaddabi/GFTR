const authService = require("../services/authService")

const register =  async (req, res , next) => {
    try {
        const {firstName, lastName, email, password} = req.body;
          const user = await authService.register(
                firstName,
                lastName,
                email,
                password
          )
          res.status(201).json({
            success : true,
            message: "User register successfully",
            user
          })
    }catch(error) {
        next(error)
    }
} 

const login =  async (req, res, next) => {
    try {
        const{email, password} = req.body
        const user = await authService.login(email, password);
         res.status(200).json({
            success: true,
            message: "login successfully",
            user : {
                id: user.id,
                fname: user.firstName,
                lname: user.lastName,
                email: user.email

            }
         })
    }catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login
}