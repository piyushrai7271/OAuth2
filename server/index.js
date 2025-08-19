import dotenv from 'dotenv';
dotenv.config();
import connectDb from './src/config/database.js';
import app from "./app.js";

connectDb()
   .then(()=>{
    app.listen(process.env.PORT || 5000, ()=>{
        console.log(`🟢🛰️ Server is running on port : ${process.env.PORT || 5000}`);
    });
   })
   .catch((error) =>{
     console.log('Error starting the server : ', error);
   })






