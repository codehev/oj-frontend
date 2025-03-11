/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_QuestionCommentVO_ } from '../models/BaseResponse_List_QuestionCommentVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_QuestionCommentVO_ } from '../models/BaseResponse_Page_QuestionCommentVO_';
import type { QuestionCommentRequest } from '../models/QuestionCommentRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionCommentControllerService {

    /**
     * 根据题目id获取评论数量
     * @param questionId questionId
     * @returns BaseResponse_long_ OK
     * @throws ApiError
     */
    public static getNumUsingGet1(
questionId: number,
): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/comment/get/num',
            query: {
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * 获取评论列表，支持根评论和子评论
     * @param questionId questionId
     * @param parentId parentId
     * @returns BaseResponse_List_QuestionCommentVO_ OK
     * @throws ApiError
     */
    public static listUsingGet1(
questionId: number,
parentId?: number,
): CancelablePromise<BaseResponse_List_QuestionCommentVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/comment/list',
            query: {
                'parentId': parentId,
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * 分页获取评论列表，支持根评论和子评论
     * @param questionId questionId
     * @param current current
     * @param pageSize pageSize
     * @param parentId parentId
     * @returns BaseResponse_Page_QuestionCommentVO_ OK
     * @throws ApiError
     */
    public static pageUsingGet1(
questionId: number,
current: number = 1,
pageSize: number = 10,
parentId?: number,
): CancelablePromise<BaseResponse_Page_QuestionCommentVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/comment/page',
            query: {
                'current': current,
                'pageSize': pageSize,
                'parentId': parentId,
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * 根据主键删除题目评论
     * @param id 题目评论主键
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static removeUsingDelete1(
id: string,
): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/question/comment/remove/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * 评论题目
     * @param questionCommentRequest 题目评论
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static saveUsingPost1(
questionCommentRequest: QuestionCommentRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/comment/save',
            body: questionCommentRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
