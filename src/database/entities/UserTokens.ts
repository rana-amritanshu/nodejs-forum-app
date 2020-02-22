import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import Users from './Users';
import { createHash } from '../../utils/crypto';
import moment from 'moment';
import jwt from 'jsonwebtoken'
import {getConnection} from 'typeorm';

@Entity()
class UserTokens {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int', nullable: true })
    client_id!: number;

    @Column('int')
    user_id!: number;

    @Column('text')
    token!: string;

    @Column('text')
    scope!: string;

    @Column({ type: 'datetime' })
    created_at!: Date;

    @Column({ type: 'datetime' })
    updated_at!: Date;

    @Column({ type: 'text' })
    expires_at!: string;

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
