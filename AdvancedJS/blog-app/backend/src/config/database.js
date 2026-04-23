const mongoose = require("mongoose");

function resolveMongoConfig() {
  const mongoUri = process.env.MONGO_URI?.trim();
  const mongoDbName = process.env.MONGO_DB_NAME?.trim();
  const legacyUri = process.env.MONGODB_URI?.trim();

  if (mongoUri && mongoDbName) {
    return { uri: mongoUri, dbName: mongoDbName };
  }
  if (legacyUri) {
    return { uri: legacyUri, dbName: undefined };
  }

  throw new Error(
    "Set MONGO_URI and MONGO_DB_NAME, or MONGODB_URI with a full connection string."
  );
}

async function connectDB() {
  try {
    const { uri, dbName } = resolveMongoConfig();

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    await mongoose.connect(uri, dbName ? { dbName } : {});

    await mongoose.connection.db.admin().ping();
    console.log(`MongoDB using database: ${mongoose.connection.name}`);

    return mongoose.connection;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = { connectDB };
