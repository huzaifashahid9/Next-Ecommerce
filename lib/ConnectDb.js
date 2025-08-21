import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URI;

// initialize global cache only once
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

let cached = global.mongoose;

export const connectDb = async () => {
  try {
    // if already connected, return connection
    if (cached.conn) return cached.conn;

    // if not connected yet, create a promise
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URL, {
        dbName: "NEXT_JS_ECOMMERCE",
        bufferCommands: false,
      });
    }

    // wait for connection & store it
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.log("Error in Connect Db : ", error.message);
  }
};
