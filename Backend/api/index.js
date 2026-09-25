const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", "config", "config.env") });

const app = require("../app");
const connectDatabase = require("../db");

module.exports = async (req, res) => {
  await connectDatabase();
  return app(req, res);
};
