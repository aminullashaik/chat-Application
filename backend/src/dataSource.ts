import "dotenv/config";
import dotenv from 'dotenv';
import {DataSource} from "typeorm";
import { Users } from "./entities/User";
import { Conversation } from "./entities/Conversation";
import { Message } from "./entities/Message";
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    synchronize: true,
    entities: [ Users, Message, Conversation ]
})

