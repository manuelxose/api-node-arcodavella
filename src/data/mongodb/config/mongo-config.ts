import mongoose from "mongoose";

interface Options {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(options: Options): Promise<void> {
    const { mongoUrl, dbName } = options;

    try {
      await mongoose.connect(mongoUrl, {
        dbName,
      });

      mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("Disconnected from MongoDB");
      });

      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });
    } catch (error) {
      console.error("Database connection error:", error);
      process.exit(1);
    }
  }

  static async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error disconnecting from MongoDB", error);
    }
  }
}
