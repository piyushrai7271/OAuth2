import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

//Routes Import and handling
import userRoutes from "./src/routes/user.routes.js";


app.use("/api/user",userRoutes);



export default app;



