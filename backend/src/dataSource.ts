import "dotenv/config";
import dotenv from 'dotenv';
import {DataSource} from "typeorm";
import { Users } from "./entities/User";
import { Conversation } from "./entities/Conversation";
import { Message } from "./entities/Message";
import path from 'path';

//doten.config() for reading the data inside the .env file
//{path} tell the dotenv tool to got for the exact location
//remainning glues .env to the end of the path

dotenv.config({ path: path.resolve(process.cwd(), ".env") }); 

export const AppDataSource = new DataSource({  //creates a new connection object and to use it we hav to call it with .initialize()
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, //automatically handles the changes done on database
    logging: true,
    entities: [ Users, Message, Conversation ]
})

