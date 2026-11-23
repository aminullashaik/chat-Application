import "reflect-metadata";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./Channel";
import { Users } from "./User";

@Entity()

export class ChannelMembers{
    
    @PrimaryGeneratedColumn()
    id! : number

    @ManyToOne(
        () => Channel,
        (channel) => channel.channelMembers,
        {
            nullable:true,
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: "channelId"})
    channel!: Channel

    @ManyToOne(
        () => Users,
        (user) => user.channelMembers,
        {
            nullable:true,
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({name: "userId"})
    user!: Users

    @CreateDateColumn()
    joinedAt!: Date
}