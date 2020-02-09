import {Router} from 'express'
import {getRepository} from 'typeorm'
import Users from '../../database/entities/Users';

const router: Router = Router()

router.get('/', async (req, res) => {
    let userRepository = getRepository(Users);
    let users = await userRepository.find();
    
    res.send(users);
});

export {router};
