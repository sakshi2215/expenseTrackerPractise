import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title:{
        type:String,
        required: true,
        lowercase :true,
        trim : true,
    },
    amount:{
        type:Number,
        required: true,
        min: 0,
    },
    category :{
        type: String,
        enum: ['Groceries', 'Leisure', 'Electronics', 'Utilities', 'Clothing', 'Health', 'Others'],
        required: true,
    },
    date:{
        type: Date,
        default :Date.now, //// User sets this manually if entering past expenses
    }
}, { timestamps: true });

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;