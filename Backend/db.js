const mongoose = require("mongoose");

let isConnected = false;

const connectDatabase = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.DB_URI) {
    throw new Error("DB_URI is missing in config/config.env");
  }

  const con = await mongoose.connect(process.env.DB_URI, {
    serverSelectionTimeoutMS: Number(process.env.DB_CONNECT_TIMEOUT_MS) || 10000,
    socketTimeoutMS: Number(process.env.DB_SOCKET_TIMEOUT_MS) || 45000,
  });

  isConnected = true;
  console.log(
    `MongoDB Database connected with HOST:${con.connection.host}`
  );
  return con;
};

module.exports = connectDatabase;
