import { Request, Response } from "express";
import { userService } from "../services/userServices";
export const signup= async(req: Request, res: Response) => {
    try {
        const {name, email, password, mobile} = req.body;

        if(!name || !email || !password || !mobile) {
            return res.status(400).json({ message: "Name, email, mobile, password are required"});
        }

        const result = await userService.createUser(req.body);
        return res.status(201).json({ message: "User registered Sucessfully", data: result});
    } catch (error: any){
        return res.status(400).json({message: error.message});
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json({message: "User fetched successfully", users});
    } catch (error: any){
        return res.status(500).json({message: "Failed to fetch users", error: error.message});
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const users = await userService.getUserById(id);
        return res.status(200).json({message: "User fetched successdully", users});
    } catch (error: any) {
        return res.status(404).json({message: "Failed to fetch ny ID"})
    }
};

export const getUserByName = async (req: Request, res: Response) => {
    try{
        const name = req.params.name as string ;
        const users = await userService.getUserByName(name);
        return res.status(200).json({message: "User fetched succesfully by name", users});
    }catch (error: any){
        return res.status(404).json({message: "Faled to fetch by name"})
        }
};

export const getUserByEmail = async(req: Request, res: Response) => {
    try{
        const email = req.params.email as string;
        const user = await userService.getUserByEmail(email);
        return res.status(200).json({message: "User fetched successfully", data: user});
    }catch (error: any){
        return res.status(404).json({ message: "Failed to fecth email"})
    }
};

export const getUserByMobile = async(req: Request, res: Response) => {
    try{
        const mobile = req.params.mobile as string;
        const user = await userService.getUserByMobile(mobile);
        return res.status(200).json({message: "User fetched successfully", data: user});
    }catch (error: any){
        return res.status(404).json({ message: "Failed to fecth mobile"})
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const user = await userService.updateUser(id, req.body);
        res.status(201).json({ message: "Updated Successfully", user});
    } catch (error: any) {
        res.status(400).json({ message: error.message});
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await userService.deleteUser(id);
        res.status(200).json({message: "Deleted successfully"});
    } catch (error: any) {
        res.status(400).json({ message: error.message});
    }
};