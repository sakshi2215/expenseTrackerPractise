import mongoose, { isValidObjectId } from "mongoose";
import Expense from "../models/expense.models.js";
import apiError from "../utils/apiError.utils.js";
import apiResponse from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";


//BASIC CURD 
const addExpense = asyncHandler(async(req, res)=>{
    const {title, amount, category, date} = req.body;
    const userID = req.user._id;

    if(!(title && amount && category)){
        throw new apiError(400, "All details are required");
    }
    if(!isValidObjectId(userID)){
        throw new apiError(403, "Unauthorized User");
    }
    const expense = await Expense.create({
        title,
        amount,
        category,
        date: date || new Date(),
        user: userID
    });

    if(!expense){
        throw new apiError(500, "Something went wrong while saving Data");
    }
    
    res.status(201)
    .json(
        new apiResponse(
            201, 
            "Successfully created the expense",
            expense,
        )
    )
    
})

const updateExpense = asyncHandler(async(req, res)=>{
    const expenseId = req.query.id;
    const { title, amount, category, date } = req.body;
    const userID = req.user._id;

    if (!isValidObjectId(expenseId)) {
        throw new apiError(400, "Invalid expense ID");
    }

    const expense = await Expense.findById(expenseId);

    if (!expense) {
        throw new apiError(404, "Expense not found");
    }

    if (expense.user.toString() !== userID.toString()) {
        throw new apiError(403, "Not allowed to update this expense");
    }

    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;

    const updatedExpense = await expense.save();

    res.status(200).json(
        new apiResponse(
        200,
        "Expense updated successfully",
         updatedExpense,
        )
    );
})


const deleteExpense = asyncHandler(async (req, res) => {
    const expenseId = req.query.id;
    const userID = req.user._id;

    if (!isValidObjectId(expenseId)) {
        throw new apiError(400, "Invalid expense ID");
    }

    const expense = await Expense.findById(expenseId);

    if (!expense) {
        throw new apiError(404, "Expense not found");
    }

    if (expense.user.toString() !== userID.toString()) {
        throw new apiError(403, "Not allowed to delete this expense");
    }

    await expense.deleteOne();

    res.status(200).json(
        new apiResponse(
            200,
            "Deleted Successfully",
        )
    );
});


const getAllExpenses = asyncHandler(async (req, res) => {
    const userID = req.user._id;

    if (!isValidObjectId(userID)) {
        throw new apiError(403, "Unauthorized");
    }

    const expenses = await Expense.find({ user: userID }).sort({ date: -1 });

    if(!expenses){
        throw new apiError(404, "No expense found");
    }
    res.status(200).json(
        new apiResponse(
            200,
            "Successfully fetched data",
             expenses,
        )
    );
});


const getExpensebyId = asyncHandler(async(req, res)=>{
    const expenseId = req.params.id;

    if (!isValidObjectId(expenseId)) {
        throw new apiError(400, "Invalid expense ID");
    }

    const expense = await Expense.findById(expenseId);

    if(!expense){
        throw new apiError(404, "No expense found");
    }

    res.status(200).json(
        new apiResponse(
            200, 
            "Successfully fetched the expense",
            expense
        )
    )
})



//Filtering the expense
const filterExpense = asyncHandler(async(req, res)=>{
    
    try{
        const { range, start, end } = req.query;
        const userId = req.user._id;
        let startDate, endDate;
        const now = new Date();
        //console.log(range)
        switch(range){
            case 'week':
                startDate = new Date(now);
                startDate.setDate(now.getDate()-7);
                startDate.setHours(0, 0, 0, 0); 
                endDate = new Date(now);
                endDate.setHours(23, 59, 59, 999); 
                break;
            
            case 'month':
                startDate= new Date(now)
                startDate.setMonth(startDate.getMonth()-1);
                endDate= new Date(now)
                break;
            case  '3months':
                startDate= new Date(now)
                startDate.setMonth(startDate.getMonth()-3);
                endDate= new Date(now)
                break;
            case 'custom':
                if(!start || !end){
                    throw new apiError(400, 'Start and end dates are required for custom range.');
                }
                startDate = new Date(start);
                endDate = new Date(end);

                if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())){
                    throw new apiError(400, 'Invalid date format.');
                }

                if(startDate > endDate){
                    throw new apiError(400, 'Start date cannot be after end date.');
                }
                break;
            default:
                throw new apiError(400, 'Invalid range type.');

            }

        const expenses = await Expense.find({
                user : new mongoose.Types.ObjectId(userId),
                date : {
                    $gte: startDate,
                    $lte: endDate
                }
            }).sort({
                date : -1,
            })
        console.log(userId);
      
        res.
        status(200)
        .json( 
            new apiResponse(200, "Fetch filtered expenses", expenses)
        )


    }
    catch(error){
        throw  new apiError(500, error.message || "Something went wrong")
    }

})

const getSummaryByCategory = asyncHandler(async(req, res)=>{

    try{
        const { range, start, end } = req.query;
        const userId = req.user._id;
        let startDate, endDate;

        switch(range){
            case 'week':
                startDate = new Date();
                startDate.setDate(startDate.getDate()-7);
                endDate = new Date();
                break;
            
            case 'month':
                startDate= new Date();
                startDate.setDate(startDate.getMonth()-1);
                endDate= new Date();
                break;
            case  '3months':
                startDate= new Date();
                startDate.setDate(startDate.getMonth()-3);
                endDate= new Date();
                break;
            case 'custom':
                if(!start || !end){
                    throw new apiError(400, 'Start and end dates are required for custom range.');
                }
                startDate = new Date(start);
                endDate = new Date(end);

                if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())){
                    throw new apiError(400, 'Invalid date format.');
                }

                if(startDate > endDate){
                    throw new apiError(400, 'Start date cannot be after end date.');
                }
                break;
            default:
                throw new apiError(400, 'Invalid range type.');

            }
        
        const summary = await Expense.aggregate([
            {
                $match : {
                user: new mongoose.Types.ObjectId(userId),
                date : { $gte : startDate, $lte : endDate}, },
            },
            {
                $group:{
                    _id : '$category',
                    totalAmount :{ $sum : '$amount'}, 
                }
            },
            {
                $project: {
                    category: '$_id',
                    totalAmount: 1,
                    _id: 0
                }
            }
            

        ])
        return res.status(200).json(new apiResponse(200, summary, 'Category-wise summary fetched successfully.'));


    }
    catch (error) {
    throw  new apiError(500, error.message || "Something went wrong")
  }

})

const getMonthlyTrends = asyncHandler(async(req, res)=>{
   
    try{
         const userId = req.user._id;
         const trends = await Expense.aggregate([
            {
                $match:{
                    user: new mongoose.Types.ObjectId(userId),
                }
            },
            {
                $group:{
                    _id:{
                        year: {$year : "$date"},
                        month : {$month : "$date"}
                    },
                    totalAmount :{
                        $sum : "$amount",
                    }
                },
                
            },
            {
                $sort : {
                    "_id.year" : 1,
                    "_id.month" :1,
                }
            },
            {
                $project :{
                    _id : 0, //not including the ids
                    month : {
                        $concat : [
                            {
                                $toString : "$_id.year"
                            },
                            "-",
                            {
                                $cond : [
                                    { $lt : ["$_id.month", 10] },
                                    { $concat: ["0", { $toString: "$_id.month" }] },
                                    { $toString : "$_id.month"}
                                ]
                            }
                        ]
                    },
                    totalAmount : 1,
                },

            }
         ])
         return res
      .status(200)
      .json(new apiResponse(200, trends, "Monthly trends fetched successfully."));
    }
    catch (error) {
    throw  new apiError(500, error.message || "Something went wrong")
  }
})

export {
    addExpense,
    updateExpense,
    getMonthlyTrends,
    getSummaryByCategory,
    filterExpense,
    getExpensebyId,
    getAllExpenses,
    deleteExpense
}

