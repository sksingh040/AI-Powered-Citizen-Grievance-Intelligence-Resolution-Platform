import mongoose from 'mongoose';

let mongoServerInstance = null;

export const connectDB = async () => {
  const configuredUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civic_grievance';
  
  // 1. Attempt connection to configured MongoDB URI (Local or MongoDB Atlas)
  try {
    console.log(`🔌 Connecting to MongoDB at: ${configuredUri.replace(/\/\/.*@/, '//<credentials>@')} ...`);
    const conn = await mongoose.connect(configuredUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ External MongoDB connection failed (${error.message}).`);
  }

  // 2. Fallback to Embedded MongoDB Instance via MongoMemoryServer
  try {
    console.log('🔄 Initializing embedded MongoDB engine instance...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoServerInstance = await MongoMemoryServer.create();
    const memoryUri = mongoServerInstance.getUri();

    const conn = await mongoose.connect(memoryUri, {
      dbName: 'civic_grievance'
    });

    console.log(`✅ Embedded MongoDB Database Active & Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (fallbackError) {
    console.error('❌ Failed to initialize MongoDB database:', fallbackError);
    process.exit(1);
  }
};

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

export const isDbMockMode = () => {
  return !isDbConnected();
};
