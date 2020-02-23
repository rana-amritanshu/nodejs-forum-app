import { getRepository, getManager, EntityManager } from 'typeorm';
import BaseController from '../../../helpers/BaseController';
import Topics from '../../../database/entities/Topics';
import { errorLogger } from '../../../utils/errorLogger';

export default class TopicsController extends BaseController
{
    public async index()
    {
        try {
            const page: number = this.request.query.page ? parseInt(this.request.query.page): 1;
            const perPage: number = this.request.query.per_page ? parseInt(this.request.query.per_page): 15;
            const skip: number = (page - 1) * perPage;
            const topicRepository = getRepository(Topics);
            const topics: Topics[] = <Topics[]>await topicRepository.find({
                relations: ["user"],
                take: perPage + 1,
                skip: skip,
                order: {id: "DESC"}
            });

            if (!topics) {
                this.response.status(404).send({
                    message: "No topics were found",
                });
            }

            let hasMorePages: boolean = false;
            if (topics.length > perPage) {
                hasMorePages = true;
                topics.pop();
            }
            
            this.response.send({
                message: 'Success',
                data: topics,
                meta: {
                    per_page: perPage,
                    current_page: page,
                    has_more_pages: hasMorePages
                }
            })
        } catch (error) {
            errorLogger("Topic Listing Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }
    }

    public async show()
    {
        try {
            const topicId: string = this.request.params.topicId;
            const topicRepository = getRepository(Topics);
            const topic: Topics = <Topics>await topicRepository.findOne(topicId, {
                relations: ["user"]
            });

            if (!topic) {
                this.response.status(404).send({
                    message: "Topic you were looking for could not be found",
                });
            }

            delete topic.user_id;

            this.response.send({
                message: "Success",
                data: topic
            });
        } catch (error) {
            errorLogger("Topic Show Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }
    }

    public async save()
    {
        try {
            const topicRepository = getRepository(Topics);
            let topic: Topics = new Topics();
            topic.title = this.request.body.title.trim();
            topic.user_id = this.request.body.authUser.id;
            topic.description = this.request.body.description.trim();
            topic.created_at = new Date();
            topic.updated_at = new Date();

            let savedTopic = await topicRepository.save(topic);

            this.response.send({
                message: 'Your topic has been saved successfully',
                data: savedTopic
            });  
        } catch (error) {
            errorLogger("Topic Save Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }                                       
    }

    public async update()
    {
        try {
            const topicId: string = this.request.params.topicId;
            const topicRepository = getRepository(Topics);
            let topic: Topics = <Topics>await topicRepository.findOne(topicId, {where: {user_id: this.request.body.authUser.id}});

            if (!topic) {
                this.response.status(404).send({
                    message: "Topic you were looking for could not be found",
                });
            }

            if (!!this.request.body.title && !!this.request.body.title.trim()) {
                topic.title = this.request.body.title.trim();
            }
            if (!!this.request.body.description && !!this.request.body.description.trim()) {
                topic.description = this.request.body.description.trim();
            }
            if (!!topic.title || !!topic.description) {
                topic.updated_at = new Date();
            }
            topic = <Topics> await topicRepository.save(topic);

            this.response.send({
                message: 'Your topic has been updated successfully',
                data: topic
            });
        } catch (error) {
            errorLogger("Topic Update Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }
    }

    public async delete()
    {
        try {
            const topicId: string = this.request.params.topicId;
            const topicRepository = getRepository(Topics);
            let topic: Topics = <Topics>await topicRepository.findOne(topicId, {where: {user_id: this.request.body.authUser.id}});

            if (!topic) {
                this.response.status(404).send({
                    message: "Topic you were looking for could not be found",
                });
            }

            await topicRepository.delete(topic);

            this.response.send({
                message: 'Your topic has been deleted successfully'
            });
        } catch (error) {
            errorLogger("Topic Delete Error:", error);
            this.response.status(500).send({
                message: 'Internal server error'
            });
        }
    }
}