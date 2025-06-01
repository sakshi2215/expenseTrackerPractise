import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import expenseRoute from "./routes/expenses.routes.js";
import userRoute from "./routes/user.routes.js";

dotenv.config()
const app = express();
const PORT= process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json({limit:"16kb"}));

//define Router
app.use("/user", userRoute);
app.use("/expenses", expenseRoute);


//connect the database

connectDB()
.then(()=>{
    app.on("error", (error)=>{
        console.log(error);
        throw error;
    })
    app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`);
});
})
.catch((error)=>{
     console.log("Mongo Db connection Failed!!", error);
});
