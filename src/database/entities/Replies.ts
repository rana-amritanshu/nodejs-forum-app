import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from "typeorm";
import {Request} from 'express'
import Users from "./Users";
import { request } from "http";
import Topics from "./Topics";
import Threads from "./Threads";

@Entity()
class Replies {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'int', unsigned: true, select: false})
    user_id!: number;

    @Column({type: 'int', unsigned: true})
    thread_id!: number;
    
    @Column('text')
    reply!: string;

    @Column('datetime')
    created_at!: Date;

    @Column('datetime')
    updated_at!: Date;

    @ManyToOne(type => Users, user => user.threads)
    @JoinColumn({name: "user_id", referencedColumnName: "id"})
    user!: Promise<Users>

    @ManyToOne(type => Threads, thread => thread.replies)
    @JoinColumn({name: "thread_id", referencedColumnName: "id"})
    thread!: Promise<Threads>
}

export default Replies;
export {Replies as entity};
