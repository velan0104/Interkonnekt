import mongoose from 'mongoose';

// Use a global variable to ensure the connection is cached during hot reloading in development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  const mongoUri = process.env.MONGO_URI;

  // Check if MONGO_URI is undefined or empty
  if (!mongoUri) {
    throw new Error('MongoDB connection URI is not defined in environment variables.');
  }

  if (!cached.promise) {
    cached.promise = new Promise((resolve, reject) => {
      mongoose.connect(mongoUri, {
        // No need to include useNewUrlParser or useUnifiedTopology anymore
      })
      .then((mongooseInstance) => resolve(mongooseInstance))
      .catch((err) => reject(err));
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("connection established")
    return cached.conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Database connection failed');
  }
}

export default dbConnect;
