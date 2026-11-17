import { Router } from "express";
import { signup } from "../controllers/user.controllers";
import { getAllUsers, getUserByEmail,getUserById,getUserByMobile,getUserByName,updateUser,deleteUser } from "../controllers/user.controllers";

const router = Router();

router.post("/signUp",signup);

router.get("/",getAllUsers);

router.get("/name/:name", getUserByName);

router.get("/email/:email", getUserByEmail);

router.get("/mobile/:mobile", getUserByMobile);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;



