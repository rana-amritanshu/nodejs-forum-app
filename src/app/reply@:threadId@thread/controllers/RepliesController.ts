import { getRepository, getManager, EntityManager } from 'typeorm';
import BaseController from '../../../helpers/BaseController';
import Replies from '../../../database/entities/Replies';
import Threads from '../../../database/entities/Threads';
import { errorLogger } from '../../../utils/errorLogger';

export default class RepliesController extends BaseController {
    public async index() {
        try {
            const thread: Threads = await this.getThread();
            const page: number = this.request.query.page ? parseInt(this.request.query.page) : 1;
            const perPage: number = this.request.query.per_page ? parseInt(this.request.query.per_page) : 15;
            const skip: number = (page - 1) * perPage;
            const replyRepository = getRepository(Replies);
            const replies: Replies[] = <Replies[]>await replyRepository.find({
                relations: ['user'],
                where: {thread_id: thread.id},
                take: perPage + 1,
                skip: skip,
                order: {id: "DESC"}
            });

            if (!replies) {
                this.response.status(404).send({
                    message: "No replies were found",
                });
            }

            let hasMorePages: boolean = false;
            if (replies.length > perPage) {
                hasMorePages = true;
                replies.pop();
            }

            this.response.send({
                message: 'Success',
                data: replies,
                meta: {
                    per_page: perPage,
                    current_page: page,
                    has_more_pages: hasMorePages
                }
            })
        } catch (error) {
            errorLogger("Reply Listing Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }
    }

    public async show() {
        try {
            const thread: Threads = await this.getThread();
            const replyId: string = this.request.params.replyId;
            const replyRepository = getRepository(Replies);
            const reply: Replies = <Replies>await replyRepository.findOne({
                where: {id: replyId, thread_id: thread.id},
                relations: ['user']
            });

            if (!reply) {
                this.response.status(404).send({
                    message: "Thread you were looking for could not be found",
                });
            }

            delete reply.user_id;

            this.response.send({
                message: "Success",
                data: reply
            });
        } catch (error) {
            errorLogger("Reply Show Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }
    }

    public async save() {
        try {
            const thread: Threads = await this.getThread();
            const replyRepository = getRepository(Replies);
            let reply: Replies = new Replies();
            reply.thread_id = thread.id;
            reply.reply = this.request.body.reply.trim();
            reply.user_id = this.request.body.authUser.id;
            reply.created_at = new Date();
            reply.updated_at = new Date();

            let savedThread = await replyRepository.save(reply);

            this.response.send({
                message: 'Your reply has been saved successfully',
                data: savedThread
            });
        } catch (error) {
            errorLogger("Reply Save Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }
    }

    public async update() {
        try {
            const thread: Threads = await this.getThread();
            const replyId: string = this.request.params.replyId;
            const replyRepository = getRepository(Replies);
            let reply: Replies = <Replies>await replyRepository.findOne(replyId, { where: { user_id: this.request.body.authUser.id, thread_id: thread.id } });

            if (!reply) {
                this.response.status(404).send({
                    message: "Thread you were looking for could not be found",
                });
            }

            if (!!this.request.body.reply && !!this.request.body.reply.trim()) {
                reply.reply = this.request.body.reply.trim();
            }

            if (!!reply.reply) {
                reply.updated_at = new Date();
            }
            reply = <Replies>await replyRepository.save(reply);

            this.response.send({
                message: 'Your reply has been updated successfully',
                data: reply
            });
        } catch (error) {
            errorLogger("Reply Update Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }
    }

    public async delete() {
        try {
            const thread: Threads = await this.getThread();
            const replyId: string = this.request.params.replyId;
            const replyRepository = getRepository(Replies);
            let reply: Replies = <Replies>await replyRepository.findOne(replyId, { where: { user_id: this.request.body.authUser.id, thread_id: thread.id } });

            if (!reply) {
                this.response.status(404).send({
                    message: "Thread you were looking for could not be found",
                });
            }

            await replyRepository.delete(reply);

            this.response.send({
                message: 'Your reply has been deleted successfully'
            });
        } catch (error) {
            errorLogger("Reply Delete Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }
    }

    private async getThread(): Promise<Threads> {
        const threadId: string = this.request.params.threadId;
        const threadRepository = getRepository(Threads);
        const thread: Threads = <Threads>await threadRepository.findOne(threadId);

        if (!thread) {
            this.response.status(404).send({
                message: "Thread you were looking for could not be found",
            });
        }

        return thread;
    }
}