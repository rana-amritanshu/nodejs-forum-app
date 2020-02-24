import { getRepository, getManager, EntityManager } from 'typeorm';
import BaseController from '../../../helpers/BaseController';
import Threads from '../../../database/entities/Threads';
import Topics from '../../../database/entities/Topics';
import { errorLogger } from '../../../utils/errorLogger';

export default class ThreadsController extends BaseController {
    public async index() {
        try {
            const topic: Topics = await this.getTopic();
            const page: number = this.request.query.page ? parseInt(this.request.query.page) : 1;
            const perPage: number = this.request.query.per_page ? parseInt(this.request.query.per_page) : 15;
            const skip: number = (page - 1) * perPage;
            const threadRepository = getRepository(Threads);
            const threads: Threads[] = <Threads[]>await threadRepository.find({
                relations: ['user'],
                where: {topic_id: topic.id},
                take: perPage + 1,
                skip: skip,
                order: {id: "DESC"}
            });

            if (!threads) {
                this.response.status(404).send({
                    message: "No threads were found",
                });
            }

            let hasMorePages: boolean = false;
            if (threads.length > perPage) {
                hasMorePages = true;
                threads.pop();
            }

            this.response.send({
                message: 'Success',
                data: threads,
                meta: {
                    per_page: perPage,
                    current_page: page,
                    has_more_pages: hasMorePages
                }
            })
        } catch (error) {
            errorLogger("Thread Listing Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }
    }

    public async show() {
        try {
            const topic: Topics = await this.getTopic();
            const threadId: string = this.request.params.threadId;
            const threadRepository = getRepository(Threads);
            const thread: Threads = <Threads>await threadRepository.findOne({
                where: {id: threadId, topic_id: topic.id},
                relations: ['user']
            });

            if (!thread) {
                this.response.status(404).send({
                    message: "Thread you were looking for could not be found",
                });
            }

            delete thread.user_id;

            this.response.send({
                message: "Success",
                data: thread
            });
        } catch (error) {
            errorLogger("Thread Show Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }
    }

    public async save() {
        try {
            const topic: Topics = await this.getTopic();
            const threadRepository = getRepository(Threads);
            let thread: Threads = new Threads();
            thread.topic_id = topic.id;
            thread.title = this.request.body.title.trim();
            thread.user_id = this.request.body.authUser.id;
            thread.description = this.request.body.description.trim();
            thread.created_at = new Date();
            thread.updated_at = new Date();

            let savedThread = await threadRepository.save(thread);

            this.response.send({
                message: 'Your thread has been saved successfully',
                data: savedThread
            });
        } catch (error) {
            errorLogger("Thread Save Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }
    }

    public async update() {
        try {
            const topic: Topics = await this.getTopic();
            const threadId: string = this.request.params.threadId;
            const threadRepository = getRepository(Threads);
            let thread: Threads = <Threads>await threadRepository.findOne(threadId, { where: { user_id: this.request.body.authUser.id, topic_id: topic.id } });

            if (!thread) {
                this.response.status(404).send({
                    message: "Thread you were looking for could not be found",
                });
            }

            if (!!this.request.body.title && !!this.request.body.title.trim()) {
                thread.title = this.request.body.title.trim();
            }
            if (!!this.request.body.description && !!this.request.body.description.trim()) {
                thread.description = this.request.body.description.trim();
            }
            if (!!thread.title || !!thread.description) {
                thread.updated_at = new Date();
            }
            thread = <Threads>await threadRepository.save(thread);

            this.response.send({
                message: 'Your thread has been updated successfully',
                data: thread
            });
        } catch (error) {
            errorLogger("Thread Update Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }
    }

    public async delete() {
        try {
            const topic: Topics = await this.getTopic();
            const threadId: string = this.request.params.threadId;
            const threadRepository = getRepository(Threads);
            let thread: Threads = <Threads>await threadRepository.findOne(threadId, { where: { user_id: this.request.body.authUser.id, topic_id: topic.id } });

            if (!thread) {
                this.response.status(404).send({
                    message: "Thread you were looking for could not be found",
                });
            }

            await threadRepository.delete(thread);

            this.response.send({
                message: 'Your thread has been deleted successfully'
            });
        } catch (error) {
            errorLogger("Thread Delete Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }
    }

    private async getTopic(): Promise<Topics> {
        const topicId: string = this.request.params.topicId;
        const topicRepository = getRepository(Topics);
        const topic: Topics = <Topics>await topicRepository.findOne(topicId);

        if (!topic) {
            this.response.status(404).send({
                message: "Topic you were looking for could not be found",
            });
        }

        return topic;
    }
}