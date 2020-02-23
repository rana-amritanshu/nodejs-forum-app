import moment from 'moment';
import {Router, Request, Response} from 'express';
import * as validations from './validations';
import AuthController from './controllers/AuthController';
import {jwtAuth} from '../../helpers/auth';

const router: Router = Router({mergeParams: true});

router.post('/register', validations.register, (req: Request, res: Response) => {
    new AuthController(req, res).register();
});

router.post('/login', validations.login, (req: Request, res: Response) => {
    new AuthController(req, res).login();
});

router.get("/profile", jwtAuth, (req: Request, res: Response) => {
    res.send(req.body.authUser);
})

export {router};