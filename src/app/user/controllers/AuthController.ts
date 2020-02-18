import argon2 from 'argon2';
import { getRepository, getManager, EntityManager } from 'typeorm';
import Users from '../../../database/entities/Users';
import UserTokens from '../../../database/entities/UserTokens';
import RefreshTokens from '../../../database/entities/RefreshTokens';
import { Request, Response } from 'express'

export default class AuthController {
    request: Request;
    response: Response;
    constructor(request: Request, response: Response) {
        this.request = request;
        this.response = response;
    }

    async register() {
        try {
            const email = this.request.body.email;

            let user = new Users();
            let userRepository = getRepository(Users);

            let findUser = await userRepository.findOne({
                where: {
                    email
                }
            });

            if (!!findUser) {
                this.response.status(400).send({
                    message: `This email is already registered with us`
                });
            } else {
                await getManager().transaction(async transactionalEntityManager => {
                    const userEntity = await user.makeData(this.request);
                    const savedUserData = await transactionalEntityManager.save(userEntity);

                    await this.saveSession(savedUserData, transactionalEntityManager);
                });

            }
        } catch (e) {
            this.response.status(500).send({
                message: 'Something went wrong'
            })
        }
    }

    async login()
    {
        try {
            const email = this.request.body.email;

            let userRepository = getRepository(Users);

            let user: any = await userRepository.findOne({
                where: {
                    email
                }
            });
            if (!user) {
                this.response.status(400).send({
                    message: `This email is not registered`
                });
            } else {
                this.createLoginSession(user);
            }
        } catch (e) {
            this.response.status(500).send({
                message: 'Something went wrong'
            });
        }
    }

    private async createLoginSession(user: Users)
    {
        try {
            let isValidPassword = await argon2.verify(user.password, this.request.body.password);
            if (!isValidPassword) {
                this.response.status(400).send({
                    message: 'Please enter a valid password'
                });
            } else {
                await getManager().transaction(async transactionalEntityManager => {
                    await this.saveSession(user, transactionalEntityManager);
                });
            }
        } catch (e) {
            throw new Error('Something went wrong');
        }
    }

    private async saveSession(user: Users, transactionalEntityManager: EntityManager) {
        const userTokenEntity = await new UserTokens().makeData(user);
        const savedUserSession = await transactionalEntityManager.save(userTokenEntity.data);

        const refreshTokenEntity = await new RefreshTokens().makeData(savedUserSession);
        await transactionalEntityManager.save(refreshTokenEntity.data);

        this.response.send({
            access_token: userTokenEntity.accessToken,
            refresh_token: refreshTokenEntity.refreshToken,
            access_token_expiry: userTokenEntity.accessTokenExpiryTime,
            refresh_token_expiry: refreshTokenEntity.refreshTokenExpiryTime
        });
    }

}