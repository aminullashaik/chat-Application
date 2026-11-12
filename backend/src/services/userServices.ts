import bcrypt from "bcryptjs";
import { Users } from "../entities/User";
import { userRepository } from "../repository/userRepository";

export const userService = {

    createUser : async (data: Partial<Users>) => {
        if(data.email) {
            const existingUser = await userRepository.findUserByEmail(data.email);
            if(existingUser){
                throw new Error("User already exist with this email");
            }
        }
        if(data.mobile) {
            const existingMobile = await userRepository.findUserByMobile(data.mobile);
            if(existingMobile){
                throw new Error("User already exist with this Mobile Number");
            }
        }
        if(!data.password){
            throw new Error("Password is required");
        }
        data.password = await bcrypt.hash(data.password, 10);
        return await userRepository.createUser(data);
        
    },

    getAllUsers: () => userRepository.findAllUsers(),

    getUserById : async(id: number) => {
        const user = await userRepository.findUserById(id);
        if(!user){
            throw new Error("User not found");
        }
        return user;
    },

    getUserByEmail: async(email: string) => {
        const user = await userRepository.findUserByEmail(email);
        if(!user){
            throw new Error("user not found");
        }
        return user;
    },

    getUserByMobile: async(mobile: string) => {
        const user = await userRepository.findUserByMobile(mobile);
        if(!user){
            throw new Error("user not found");
        }
        return user;
    },

    getUserByName : async(name: string) => {
        const user = await userRepository.findUserByName(name);
        if(!user){
            throw new Error("user not found");
        }
        return user;
    },

    updateUser : async(id: number, data: Partial<Users>) => {
        const user = await userService.getUserById(id);
        if(!user){
            throw new Error("User not found");
        }
        if(data.email){
            const existinhEmail = await userRepository.findUserByEmail(data.email);
            if(existinhEmail){
                throw new Error("User with this email already Exist");
            }
        }
        if(data.mobile){
            const existingMobile = await userRepository.findUserByMobile(data.mobile);
            if(existingMobile){
                throw new Error("User with this Mobile Number already Exist")
            }
        }
        if(data.password){
            data.password = await bcrypt.hash(data.password, 10);
        }
        Object.assign(user, data);
        return await userRepository.updateUser(user);
    },

    deleteUser: async(id: number) => {
        const user = await userService.getUserById(id);
        const result = await userRepository.deleteUser(user.id);
        if(!result.affected){
            throw new Error("Not found");
        }
        return result;
    }
}