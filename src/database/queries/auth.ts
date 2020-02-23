import Users from '../entities/Users';
import {getConnection} from 'typeorm';
import AuthUser from '../models/AuthUser';
import UserTokens from '../entities/UserTokens';

export const getUserFromToken = async (userId: number, hashedToken: string): Promise<AuthUser> => {
    const user: AuthUser = await getConnection()
        .getRepository(Users)
        .createQueryBuilder("users")
        .select("users.name, users.email, users.id")
        .innerJoin("user_tokens", "user_tokens" ,"users.id=user_tokens.user_id AND user_tokens.token = :hashedToken", {hashedToken})
        .where("users.id = :userId", {hashedToken, userId})
        .getRawOne();

    return user;
}

