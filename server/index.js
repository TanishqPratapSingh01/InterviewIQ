import express from "express"
import dotenv from "dotenv"
dotenv.config()

import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"

// 1. Initialize the Express app here
const app = express()

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/payment", paymentRouter)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDb()
})