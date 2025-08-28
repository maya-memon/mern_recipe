import express from "express";
import mongoose from "mongoose";
import  bodyParser from "express";
import userRouter from "./routes/user.js";
import recipeRouter from "./routes/recipe.js";
import cors from "cors";
const app = express(); 

app.use(express.json()); // instead of bodyParser
app.use(cors({
  origin: "https://recipe-food1.netlify.app", // your frontend
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use("/api",userRouter);
app.use("/api",recipeRouter);
mongoose
  .connect(
    "mongodb+srv://marriamnoor68:maya%4046@cluster0.otdbxw8.mongodb.net/",
    {
      dbName: "Mern_recipe",
    }
  )
  .then(() => console.log("MongoDB is Connected..!"))
  .catch((err) => console.log(err.message));

const port = 3000;
app.listen(port, () => console.log(`server is running on port ${port}`));

//username=marriamnoor68marriamnoor68;
//password=maya@46