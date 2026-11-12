import 'reflect-metadata'
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index,  OneToMany,  PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Message } from './Message';
import { Conversation } from './Conversation';

enum UserStatus {
    ONLINE = "Online",
    OFFLINE = "Ofline"
}

@Entity()

@Index(
    "IDX_Users_email_unique_set",
    ["email"],
    {
        unique: true,
        where: "'deletedAt' IS NULL"
    }
)

@Index(
    "IDX_Users_mobile_unique_set",
    ["mobile"],
    {
        unique: true,
        where: '"deletedAt" IS NULL'
    }
)

export class Users {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    name! : string

    @Column({ type: "varchar" })
    email!: string

    @Column({ type: "varchar" })
    password! : string

    @Column({ type: "text" })
    mobile!: string

    @Column({ type: "text" })
    role!: string

    @Column({ type: "enum", enum: UserStatus, default: UserStatus.ONLINE })
    status!: string

    @CreateDateColumn()
    createdAt! : Date

    @UpdateDateColumn()
    updatedAt! : Date

    @DeleteDateColumn({ type: "timestamp", nullable: true, name: "deletedAt"})
    deletedAt! : Date

    @OneToMany(() => Message, (message) => message.user)
    message!: Message[]

    @OneToMany(() => Conversation, (conversation1) => conversation1.user1)
    conversation1!: Conversation[]

    @OneToMany(() => Conversation, (conversation2) => conversation2.user2)
    conversation2!: Conversation[]

}