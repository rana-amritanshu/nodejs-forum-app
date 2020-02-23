import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from "typeorm";
import {Request} from 'express'
import Users from "./Users";
import { request } from "http";
import Topics from "./Topics";

@Entity()
class Threads {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'int', unsigned: true, select: false})
    user_id!: number;

    @Column({type: 'int', unsigned: true})
    topic_id!: number;
    
    @Column('varchar')
    title!: string;

    @Column('text')
    description!: string;

    @Column('datetime')
    created_at!: Date;

    @Column('datetime')
    updated_at!: Date;

    @ManyToOne(type => Users, user => user.threads)
    @JoinColumn({name: "user_id", referencedColumnName: "id"})
    user!: Promise<Users>

    @ManyToOne(type => Topics, topic => topic.threads)
    @JoinColumn({name: "topic_id", referencedColumnName: "id"})
    topic!: Promise<Topics>
}

export default Threads;
export {Threads as entity};
