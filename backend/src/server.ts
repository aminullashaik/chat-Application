import express from "express";
import { AppDataSource } from "./dataSource";
import userRoutes from "../src/routes/userRoutes";
import authRoutes from "../src/routes/authRoutes"
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);


AppDataSource.initialize().then(()=> {
app.get("/",( {}, res: any) => {
    res.send("Connected successfully");
});


app.listen (PORT, () => {
    console.log(`Server running of ${PORT}`);
});
});