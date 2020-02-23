import {Router, Request, Response} from 'express'
import { postTopic } from './validations';
import { jwtAuth } from '../../helpers/auth';
import TopicsController from './controllers/TopicsController';

const router: Router = Router({mergeParams: true});

router.get('/', async (req, res) => {
    await new TopicsController(req, res).index();
});

router.post('/', postTopic, jwtAuth, async (req: Request, res: Response) => {
    await new TopicsController(req, res).save();
});

router.get('/:topicId', async (req, res) => {
    await new TopicsController(req, res).show();
});

router.put('/:topicId', jwtAuth, async (req, res) => {
    await new TopicsController(req, res).update();
});

router.delete('/:topicId', jwtAuth, async (req, res) => {
    await new TopicsController(req, res).delete();
});

export {router};
