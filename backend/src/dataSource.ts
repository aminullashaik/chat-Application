import {DataSource} from "typeorm";
import { Users } from "./entities/User";
import { Conversation } from "./entities/Conversation";
import { Message } from "./entities/Message";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "7862",
    database: "chat_application",
    synchronize: true,
    logging: true,
    entities: [
        Users,
        Conversation,
        Message
        
    ],
})