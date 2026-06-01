const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);

const connectDatabase = async () => {
  if (!process.env.DB_URI) {
    throw new Error("DB_URI is missing in config/config.env");
  }

  const con = await mongoose.connect(process.env.DB_URI, {
    serverSelectionTimeoutMS: Number(process.env.DB_CONNECT_TIMEOUT_MS) || 5000,
    socketTimeoutMS: Number(process.env.DB_SOCKET_TIMEOUT_MS) || 5000,
  });

  console.log(
    `MongoDB Database connected with HOST:${con.connection.host}`
  );
};

module.exports = connectDatabase;
