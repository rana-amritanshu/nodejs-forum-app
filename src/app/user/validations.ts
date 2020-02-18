import validator from 'validator';
import {Request, Response, NextFunction} from 'express';
import {RegisterErrorBag} from './errorBags'

export const register = (req: Request, res: Response, next: NextFunction) => {
    let errorBag: RegisterErrorBag = {};
    const data = req.body;
    let name: string = !!data.name && !!data.name.trim() ? data.name.trim() : '' ;
    let email: string = !!data.email && !!data.email.trim() ? data.email.trim() : '' ;
    let password: string = !!data.password && !!data.password.trim() ? data.password.trim() : '' ;

    if (!validator.isEmail(email)) {
        errorBag.email = 'Please enter a valid email';
    }
    if (validator.isEmpty(name)) {
        errorBag.name = 'Name field is required';
    }
    if (validator.isEmpty(password)) {
        errorBag.password = 'Password field is required';
    }
    if (Object.keys(errorBag).length > 0) {
        res.status(422).send({
            error: errorBag
        });
    }
    next();
}

export const login = (req: Request, res: Response, next: NextFunction) => {
    let errorBag: RegisterErrorBag = {};
    const data = req.body;
    let email: string = !!data.email && !!data.email.trim() ? data.email.trim() : '' ;
    let password: string = !!data.password && !!data.password.trim() ? data.password.trim() : '' ;

    if (!validator.isEmail(email)) {
        errorBag.email = 'Please enter a valid email';
    }
    if (validator.isEmpty(password)) {
        errorBag.password = 'Password field is required';
    }
    if (Object.keys(errorBag).length > 0) {
        res.status(422).send({
            error: errorBag
        });
    }
    next();
}
