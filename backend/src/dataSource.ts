import "dotenv/config";
import dotenv from 'dotenv';
import {DataSource} from "typeorm";
import { Users } from "./entities/User";
import { Conversation } from "./entities/Conversation";
import { Message } from "./entities/Message";
import path from 'path';

dotenv.config({path: path.resolve(__dirname, "../.env")})

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: String(process.env.DB_PASSWORD || ""),
    database: process.env.DB_NAME,
    logging: true,
    synchronize: true,
    entities: [ Users, Message, Conversation ]
})

