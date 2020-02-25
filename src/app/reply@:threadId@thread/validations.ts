import validator from 'validator';
import {Request, Response, NextFunction} from 'express';
import {ReplyErrorBag} from './errorBags';

export const postThread = (req: Request, res: Response, next: NextFunction) => {
    let errorBag: ReplyErrorBag = {};
    const data = req.body;
    let reply: string = !!data.reply && !!data.reply.trim() ? data.reply.trim() : '' ;

    if (validator.isEmpty(reply)) {
        errorBag.reply = 'Reply is required';
    }

    if (Object.keys(errorBag).length > 0) {
        res.status(422).send({
            error: errorBag
        });
    }

    req.body.reply = reply;

    next();
}