import mongoose from "mongoose";

// mongoose.set("strictQuery", true);

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "UdemyCommerce",
    });
    console.log(`Server connected to database ${connection.host}`);
  } catch (error) {
    console.log("some error Occured ", error);
    process.exit(1);
  }
};
