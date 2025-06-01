# 💸 Expense Tracker API

An easy-level backend project to manage and track personal expenses with secure user authentication using JWT.

---

## 🚀 Features

- 👤 **User Authentication**
  - Sign up / Login
  - JWT-based session management

- 💼 **Expense Management**
  - Add new expenses
  - Update existing expenses
  - Delete expenses
  - Get all expenses
  - Filter expenses by:
    - Past Week
    - Last Month
    - Last 3 Months
    - Custom Date Range

- 📊 **Expense Summary**
  - Category-wise total spending (Groceries, Leisure, Electronics, etc.)

---

## 🛠️ Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** (for authentication)
- **dotenv** (for environment configs)

---

## 📦 Expense Categories

You can assign expenses to one of the following categories:
- 🛒 Groceries  
- 🎮 Leisure  
- 💻 Electronics  
- 💡 Utilities  
- 👗 Clothing  
- 🏥 Health  
- 🗃 Others  

---

## 🔐 Authentication

All routes except signup/login are **JWT protected**.  
Use the token in headers like this:

```http
Authorization: Bearer <your_token_here>
