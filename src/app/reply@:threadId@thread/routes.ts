import {Router, Request, Response} from 'express'
import { postThread } from './validations';
import { jwtAuth } from '../../helpers/auth';
import RepliesController from './controllers/RepliesController';

const router: Router = Router({mergeParams: true});

router.get('/', async (req, res) => {
    await new RepliesController(req, res).index();
});

router.post('/', postThread, jwtAuth, async (req: Request, res: Response) => {
    await new RepliesController(req, res).save();
});

router.get('/:threadId', async (req, res) => {
    await new RepliesController(req, res).show();
});

router.put('/:threadId', jwtAuth, async (req, res) => {
    await new RepliesController(req, res).update();
});

router.delete('/:threadId', jwtAuth, async (req, res) => {
    await new RepliesController(req, res).delete();
});

export {router};
