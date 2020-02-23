import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import Users from './Users';
import { createHash } from '../../utils/crypto';
import moment from 'moment';
import jwt from 'jsonwebtoken'
import {getConnection} from 'typeorm';
import RefreshTokens from "./RefreshTokens";

@Entity()
class UserTokens {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int', nullable: true, unsigned: true })
    client_id!: number;

    @Column({type: 'int', unsigned: true})
    user_id!: number;

    @Column('varchar')
    token!: string;

    @Column('text')
    scope!: string;

    @Column({ type: 'datetime' })
    created_at!: Date;

    @Column({ type: 'datetime' })
    updated_at!: Date;

    @Column({ type: 'varchar' })
    expires_at!: string;

    @ManyToOne(type => Users, user => user.userTokens)
    @JoinColumn({name: "user_id", referencedColumnName: "id"})
    user!: Promise<Users>;

    @OneToMany(type => RefreshTokens, refreshToken => refreshToken.userToken)
    @JoinColumn({name: "id", referencedColumnName: "user_token_id"})
    refreshToken!: Promise<RefreshTokens[]>;

    async makeData(user: Users) {
        const secret: string = <string>process.env.JWT_HASH;
        const accessToken = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email
        }, secret, {
            expiresIn: "1 day"
        });
        let time = moment(new Date());
        let accessTokenExpiryTime = time.add(1, 'day').format("Y-M-D hh:mm:ss");

        this.user_id = user.id;
        this.token = createHash(accessToken, 'sha256');
        this.scope = '*';
        this.created_at = new Date();
        this.updated_at = new Date();
        this.expires_at = accessTokenExpiryTime;
        
        return { data: this, accessToken, accessTokenExpiryTime };
    }
}

export default UserTokens;
export { UserTokens as entity }
