import { jwtVerify } from "../middleware/auth.middleware.js";
import {
    addExpense,
    updateExpense,
    getMonthlyTrends,
    getSummaryByCategory,
    filterExpense,
    getExpensebyId,
    getAllExpenses,
    deleteExpense
} from "../controllers/expense.controllers.js";
import { Router } from "express";

const router = Router();

// CRUD Routes
router.post("/addExpense", jwtVerify, addExpense);
router.put("/updateExpense", jwtVerify, updateExpense);
router.post("/deleteExpense", jwtVerify, deleteExpense);


// Filter & Aggregation routes
router.get("/filter", jwtVerify, filterExpense);
router.get("/summary", jwtVerify, getSummaryByCategory);
router.get("/trends", jwtVerify, getMonthlyTrends);

// Fetch routes
router.get("/", jwtVerify, getAllExpenses);
router.get("/:id", jwtVerify, getExpensebyId);

export default router;