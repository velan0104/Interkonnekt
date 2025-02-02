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
        dbName: "social_media"
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


// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
// import { MongoClient, ServerApiVersion } from "mongodb"
 
// if (!process.env.MONGODB_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
// }
 
// const uri = process.env.MONGODB_URI
// const options = {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// }
 
// let client: MongoClient
 
// if (process.env.NODE_ENV === "development") {
//   // In development mode, use a global variable so that the value
//   // is preserved across module reloads caused by HMR (Hot Module Replacement).
//   let globalWithMongo = global as typeof globalThis & {
//     _mongoClient?: MongoClient
//   }
 
//   if (!globalWithMongo._mongoClient) {
//     globalWithMongo._mongoClient = new MongoClient(uri, options)
//   }
//   client = globalWithMongo._mongoClient
// } else {
//   // In production mode, it's best to not use a global variable.
//   client = new MongoClient(uri, options)
// }
 
// // Export a module-scoped MongoClient. By doing this in a
// // separate module, the client can be shared across functions.
// export default client
