import { Request, Response } from 'express'

export default class BaseController
{
    request: Request;
    response: Response;
    constructor(request: Request, response: Response) {
        this.request = request;
        this.response = response;
    }
}