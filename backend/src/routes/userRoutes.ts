import { Router } from "express";
import { signup } from "../controllers/userControllers";
import { getAllUsers, getUserByEmail,getUserById,getUserByMobile,getUserByName,updateUser,deleteUser } from "../controllers/userControllers";

const router = Router();

router.post("/signup",signup);

router.get("/",getAllUsers);

router.get("/:id", getUserById);

router.get("/name/:name", getUserByName);

router.get("/email/:email", getUserByEmail);

router.get("/mobile/:mobile", getUserByMobile);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;



