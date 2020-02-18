import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";
import {Request} from 'express'
import argon2 from 'argon2'

@Entity()
class Users {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    name!: string;

    @Column('text')
    password!: string;

    @Column('text')
    email!: string;

    @Column('datetime')
    created_at!: Date;

    @Column('datetime')
    updated_at!: Date;

    public async makeData(request : Request)
    {
        this.password = await argon2.hash(request.body.password);
        this.name = request.body.name;
        this.email = request.body.email;
        this.created_at = new Date();
        this.updated_at = new Date();

        return this;
    }
}

export default Users;
export {Users as entity}
