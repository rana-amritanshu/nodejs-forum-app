import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn} from "typeorm";
import {Request} from 'express'
import argon2 from 'argon2'
import UserTokens from "./UserTokens";
import Topics from "./Topics";
import Threads from "./Threads";

@Entity()
class Users {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar')
    name!: string;

    @Column({type: 'varchar'})
    password!: string;

    @Column('varchar')
    email!: string;

    @Column('datetime')
    created_at!: Date;

    @Column('datetime')
    updated_at!: Date;

    @OneToMany(type => UserTokens, userTokens => userTokens.user)
    @JoinColumn({name: "id", referencedColumnName: "user_id"})
    userTokens!: Promise<UserTokens[]>;

    @OneToMany(type => Topics, topics => topics.user)
    @JoinColumn({name: "id", referencedColumnName: "user_id"})
    topics!: Promise<Topics[]>;

    @OneToMany(type => Threads, threads => threads.user)
    @JoinColumn({name: "id", referencedColumnName: "user_id"})
    threads!: Promise<Threads[]>;

    public async makeData(request : Request)
    {
        this.password = await argon2.hash(request.body.password);
        this.name = request.body.name.trim();
        this.email = request.body.email.trim();
        this.created_at = new Date();
        this.updated_at = new Date();

        return this;
    }
}

export default Users;
export {Users as entity}
