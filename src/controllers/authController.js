const authService = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await authService.register(
      firstName,
      lastName,
      email,
      password,
    );
    res.status(201).json({
      success: true,
      message: "User register successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({
      success: true,
      message: "login successfully",
      user: {
        id: result.user.id,
        fname: result.user.firstName,
        lname: result.user.lastName,
        email: result.user.email,
        role: result.user.role,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const accessToken = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
};
