import moment from 'moment';
import {Router, Request, Response} from 'express';
import * as validations from './validations';
import AuthController from './controllers/AuthController';

const router: Router = Router();

router.post('/register', validations.register, (req: Request, res: Response) => {
    new AuthController(req, res).register();
});

router.post('/login', validations.login, (req: Request, res: Response) => {
    new AuthController(req, res).login();
});

export {router};