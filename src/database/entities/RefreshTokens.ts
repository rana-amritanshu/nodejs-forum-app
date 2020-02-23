import {Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn} from "typeorm";
import UserTokens from './UserTokens';
import {getRandomBytes, createHash} from '../../utils/crypto';
import moment from 'moment';

@Entity()
class RefreshTokens {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'int', unsigned: true})
    user_token_id!: number;

    @Column('varchar')
    token!: string;

    @Column({type: 'datetime'})
    created_at!: Date;

    @Column({type: 'varchar'})
    expires_at!: string;

    @OneToMany(type => UserTokens, refreshToken => refreshToken.refreshToken)
    @JoinColumn({name: "user_token_id", referencedColumnName: "id"})
    userToken!: Promise<UserTokens[]>;

    async makeData(userTokens: UserTokens)
    {
        let randomBytes = await getRandomBytes();
        const refreshToken = createHash(`${userTokens.user_id}-${userTokens.id}-${randomBytes}`);

        let date = new Date();
        let time = moment(date);
        let refreshTokenExpiryTime = time.add(2, 'day').format("Y-M-D hh:mm:ss");

        this.user_token_id = userTokens.id;
        this.token = createHash(refreshToken, 'sha256');
        this.created_at = date;
        this.expires_at = refreshTokenExpiryTime;

        return {data:this, refreshToken, refreshTokenExpiryTime};
    }
}

export default RefreshTokens;
export {RefreshTokens as entity}
