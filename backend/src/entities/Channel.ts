import "reflect-metadata";
import { Entity, Column, CreateDateColumn , UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Channel {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({type: "text"})
    name!: string

    @Column({ type: "text"})
    description!: string

    @Column({ type: "integer"})
    createdBy!: number

    @CreateDateColumn()
    createdAt! : Date

    @UpdateDateColumn()
    updatedAt!: Date

    @DeleteDateColumn({ type: "timestamp", nullable: true})
    deletedAt!: Date

}