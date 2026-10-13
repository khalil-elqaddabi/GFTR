
const apiVersionMiddleware = (version) => {
  return (req, res, next) => {
    res.setHeader("X-API-Version", version);
    res.setHeader("X-API-Deprecated", "false");

    next();
  };
};

module.exports = apiVersionMiddleware;
