import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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
}

export default Users;
export {Users as entity}
