import "reflect-metadata"
import { Column, PrimaryGeneratedColumn, Entity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { Users } from "./User"
import { Conversation } from "./Conversation"

@Entity()

export class Message {

    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(
        () => Conversation,
        (conversation) => conversation.message,
        {
            nullable: true,
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: "conversationId"})
    conversation!: Conversation[]

    @ManyToOne(
        () => Users,
        (user) => user.message,
        {
            nullable: true,
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: "senderId"})
    user! : Users

    @Column({ type: 'text'})
    content! : string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt! : Date

    @DeleteDateColumn({ type: "timestamp", nullable: true, name: "deletedAt"})
    deletedAt! : Date
}