import mongoose from "mongoose";

const connectdb = async ()=>{
    try{
        const connect = await mongoose.connect(`${process.env.MONGO_DB_URI}/${process.env.MONGODB_NAME}`);
        
        console.log(`\n Connected to the database!! DB HOST: ${connect.connection.host}`);
    }
    catch(error){
        console.error("Error: ", error);
        process.exit(1); //node js we can exit the process
        throw error
    }
}

export default connectdb;