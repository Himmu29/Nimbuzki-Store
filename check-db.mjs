import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

async function checkDb() {
  try {
    console.log("Connecting to:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Collections in current DB:", collections.map(c => c.name));

    const users = await db.collection("users").find({}).toArray();
    console.log("Total Users found:", users.length);
    console.log("Users:", users);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

checkDb();
