import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "Library_Managment"
    })
        .then(() => {
            console.log(`Database is connected successfully`);
        })
        .catch((err)=>{
            console.error(`error connection`,err)
        })
}