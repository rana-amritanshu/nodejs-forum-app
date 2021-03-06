import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import {Request} from 'express'
import Users from "./Users";
import { request } from "http";
import Threads from "./Threads";

@Entity()
class Topics {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'int', unsigned: true, select: false})
    user_id!: number;
    
    @Column('varchar')
    title!: string;

    @Column('text')
    description!: string;

    @Column('datetime')
    created_at!: Date;

    @Column('datetime')
    updated_at!: Date;

    @ManyToOne(type => Users, user => user.topics)
    @JoinColumn({name: "user_id", referencedColumnName: "id"})
    user!: Promise<Users>

    @OneToMany(type => Threads, threads => threads.user)
    @JoinColumn({name: "id", referencedColumnName: "topic_id"})
    threads!: Promise<Threads[]>;
}

export default Topics;
export {Topics as entity};
