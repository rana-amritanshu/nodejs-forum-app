import validator from 'validator';
import {Request, Response, NextFunction} from 'express';
import {ThreadErrorBag} from './errorBags';

export const postThread = (req: Request, res: Response, next: NextFunction) => {
    let errorBag: ThreadErrorBag = {};
    const data = req.body;
    let title: string = !!data.title && !!data.title.trim() ? data.title.trim() : '' ;
    let description: string = !!data.description && !!data.description.trim() ? data.description.trim() : '' ;

    if (validator.isEmpty(title)) {
        errorBag.title = 'Title is required';
    }
    if (validator.isEmpty(description)) {
        errorBag.description = 'Description is requried';
    }

    if (Object.keys(errorBag).length > 0) {
        res.status(422).send({
            error: errorBag
        });
    }

    req.body.title = title;
    req.body.description = description;

    next();
}