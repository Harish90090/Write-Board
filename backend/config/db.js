import mongoose from "mongoose";
export const connectdb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://harishachar9090_db_user:Cu0FRcTxPVuqMWGL@cluster0.tadpff8.mongodb.net/write_db?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("mongo db connected successfully");
  } catch (error) {
    console.error("mongodb doesnt connected succesfully");
  }
};
export default connectdb;
