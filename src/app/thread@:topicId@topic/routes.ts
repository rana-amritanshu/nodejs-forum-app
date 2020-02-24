import {Router, Request, Response} from 'express'
import { postThread } from './validations';
import { jwtAuth } from '../../helpers/auth';
import ThreadsController from './controllers/ThreadsController';

const router: Router = Router({mergeParams: true});

router.get('/', async (req, res) => {
    await new ThreadsController(req, res).index();
});

router.post('/', postThread, jwtAuth, async (req: Request, res: Response) => {
    await new ThreadsController(req, res).save();
});

router.get('/:threadId', async (req, res) => {
    await new ThreadsController(req, res).show();
});

router.put('/:threadId', jwtAuth, async (req, res) => {
    await new ThreadsController(req, res).update();
});

router.delete('/:threadId', jwtAuth, async (req, res) => {
    await new ThreadsController(req, res).delete();
});

export {router};
