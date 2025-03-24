const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema({
  title: String,
  value: mongoose.Schema.Types.Mixed,
});

const Dashboard = mongoose.model("Dashboard", dashboardSchema, "dashboard");

module.exports = Dashboard;
