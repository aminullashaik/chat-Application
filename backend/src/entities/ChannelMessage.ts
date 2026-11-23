import "reflect-metadata";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Channel } from "./Channel";
import { Users } from "./User";

@Entity()

export class ChannelMessage {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    channelId!: number

    @Column()
    senderId!: number

    @ManyToOne(() => Channel, (channel) => channel.channelMessage, {nullable: true, onDelete:"CASCADE"})
    @JoinColumn({name: "channelId"})
    channel!: Channel;

    @ManyToOne(() => Users, (user) => user.channelMessage, {nullable: true, onDelete: "CASCADE"})
    @JoinColumn({ name: "senderId" })
    user!: Users

    @Column({ type: "text" })
    content!: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt!: Date
}