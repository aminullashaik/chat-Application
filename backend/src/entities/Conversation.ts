import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./User";
import { Message } from "./Message";

@Entity ("conversation")

@Index(
    "IDX_user1_id_unique_set",
    ['userOneId'],
    {
        unique: true,
        where: '"deletedAt" IS NULL'
    }
)

@Index(
    "IDX_user2_id_unique_set",
    ['userTwoId'],
    {
        unique: true,
        where: '"deletedAt" IS NULL'
    }
)

export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'integer'})
    userOneId!: number

    @Column({type: 'integer'})
    userTwoId!: number

    @ManyToOne(() => Users, (user1) => user1.conversation1,{nullable: true, onDelete: "CASCADE"})
    @JoinColumn({ name: 'userOneId'})
    user1: Users;

    @ManyToOne(() => Users, (user2) => user2.conversation2, {nullable: true, onDelete: "CASCADE"})
    @JoinColumn({ name: "userTwoId"})
    user2: Users;

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updateAt : Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true, name: "deletedAt"})
    deletedAt :Date;

    @OneToMany(() => Message, (message) => message.conversation)
    message! : Message[];
}