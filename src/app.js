const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const testRoutes = require("./routes/testRoutes");
// b2
const apiVersionMiddleware = require("./middlewares/apiVersionMiddleware");
const v1Routes = require("./routes/v1Routes");
const v2Routes = require("./routes/v2Routes");

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API v1 - versioned routes
app.use("/api/v1", apiVersionMiddleware("1.0.0"), v1Routes);
// API v2
app.use("/api/v2", apiVersionMiddleware("2.0.0"), v2Routes);

// Legacy routes - backward compatibility with Brief 1
app.use("/api", apiVersionMiddleware("1.0.0"), v1Routes);

app.get("/", (req, res) => {
  res.json({
    message: "fleet Management API is running",
  });
});

app.use("/api/test", testRoutes);

app.use(errorHandler);

module.exports = app;