import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from "typeorm";
import {Request} from 'express'
import Users from "./Users";
import { request } from "http";

@Entity()
class Topics {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'int', unsigned: true})
    user_id!: string;
    
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
}

export default Topics;
export {Topics as entity};
