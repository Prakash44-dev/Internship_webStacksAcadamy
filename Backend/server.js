// Load env variables FIRST
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "config", "config.env") });

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

// Import app & DB AFTER env loaded
const app = require("./app");
const connectDatabase = require("./db");
const port = Number(process.env.PORT) || 8000;

let server;

const startServer = async () => {
  try {
    await connectDatabase();

    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    console.log("Shutting down server because database connection failed");
    process.exit(1);
  }
};

startServer();

// Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down server due to Unhandled Promise rejection");

  if (server) {
    server.close(() => process.exit(1));
    return;
  }

  process.exit(1);
});
