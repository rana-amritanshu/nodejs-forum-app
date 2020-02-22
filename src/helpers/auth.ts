import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';
import { createHash } from '../utils/crypto';
import { getUserFromToken } from '../database/queries/auth';
import AuthUser from '../database/models/AuthUser';

interface JwtTokenPayload {
    id: number,
    name: string,
    email: string,
    iat?: number | string,
    exp?: number | string
};

export const jwtAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization: string = <string>req.get('authorization');
        const token: string = authorization.replace("Bearer ", "");
        const secret: string = <string>process.env.JWT_HASH;
        const isValidToken = jwt.verify(token, secret, {ignoreExpiration: false});

        if (!isValidToken) {
            res.status(401).send({
                message: 'Access token is not valid'
            });
        } 

        const decodedToken: JwtTokenPayload = <JwtTokenPayload>jwt.decode(token);
        const userId: number = decodedToken.id;
        const hashedToken: string = createHash(token, "sha256");
        const user: AuthUser = await getUserFromToken(userId, hashedToken);

        if (!user) {
            res.status(400).send({
                message: 'Invalid access token, login & please try again'
            });
        }

        req.body.authUser = user;
        next();
    } catch(error) {
        if (!!error.name && (error.name == 'JsonWebTokenError' || error.name == 'TokenExpiredError')) {
            res.status(400).send({
                message: !!error.message ? error.message : 'Invalid access token, please login & try again'
            });
        } else {
            console.log(error);
            res.status(400).send({
                message: 'Invalid access token, please login & try again'
            });
        }
    }
}