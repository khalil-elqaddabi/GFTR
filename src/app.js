const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const camionRoutes = require("./routes/camionRoutes");
const remorqueRoutes = require("./routes/remorqueRoutes");
const pneuRoutes = require("./routes/pneuRoutes");
const trajetRoutes = require("./routes/trajetRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const maintenanceRuleRoutes = require("./routes/maintenanceRuleRoutes");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/camions", camionRoutes);
app.use("/api/remorques", remorqueRoutes);
app.use("/api/pneus", pneuRoutes);
app.use("/api/trajets", trajetRoutes);
app.use("/api/maintenances", maintenanceRoutes);
app.use("/api/maintenance-rules", maintenanceRuleRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "fleet Management API is running",
  });
});
app.use(errorHandler);
app.use("/api/test", testRoutes);

module.exports = app;
