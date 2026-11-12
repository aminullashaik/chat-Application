import { ILike } from "typeorm";
import { AppDataSource } from "../dataSource";
import { Users } from "../entities/User";

export const userRepository = {

    createUser : async (data: Partial<Users>) =>{ 
        return await AppDataSource.getRepository(Users).save(data);
    },

    findAllUsers: async() =>{
        return await AppDataSource.getRepository(Users).find({
            order: {name: "ASC"}
        })},

    findUserById: async (id: number) => {
        return await AppDataSource.getRepository(Users).findOne({
            where: {id}
        });
    },

    findUserByEmail : async (email : string) =>{
        return await AppDataSource.getRepository(Users).findOne({
            where: {email: ILike(email.trim())}});
        },
    findUserByMobile : async (mobile: string) => {
        return await AppDataSource.getRepository(Users).findOne({
            where: {mobile: mobile.trim()}
        })
    },

    findUserByName : async(name: string) => {
        return await AppDataSource.getRepository(Users).findOne({
            where: {name: ILike(name.trim())}
        });
    },

    updateUser : async (user: Users) => {
        return await AppDataSource.getRepository(Users).save(user);
    },

    deleteUser: async (id: number) => {
        return await AppDataSource.getRepository(Users).softDelete(id);
    },
    
};