import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from "./routes/blogRoutes.js";
import userRouter from "./routes/userRoutes.js";
import errorHandler from './middleware/errorHandler.js'

const app = express();

await connectDB();

// MIddlewares

app.use(express.json())

// Routes
app.get('/', (req,res) => {
    res.send("API is working")
});

app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.use('/api/admin', adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log("Server is running on port "+ PORT)
})

export default app;

