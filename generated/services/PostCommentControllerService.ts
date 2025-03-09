/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_PostCommentVO_ } from '../models/BaseResponse_List_PostCommentVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_PostCommentVO_ } from '../models/BaseResponse_Page_PostCommentVO_';
import type { PostCommentRequest } from '../models/PostCommentRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PostCommentControllerService {

    /**
     * 根据帖子id获取评论数量
     * @param postId postId
     * @returns BaseResponse_long_ OK
     * @throws ApiError
     */
    public static getNumUsingGet(
postId: number,
): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post/comment/get/num',
            query: {
                'postId': postId,
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
     * @param postId postId
     * @param parentId parentId
     * @returns BaseResponse_List_PostCommentVO_ OK
     * @throws ApiError
     */
    public static listUsingGet(
postId: number,
parentId?: number,
): CancelablePromise<BaseResponse_List_PostCommentVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post/comment/list',
            query: {
                'parentId': parentId,
                'postId': postId,
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
     * @param postId postId
     * @param current current
     * @param pageSize pageSize
     * @param parentId parentId
     * @returns BaseResponse_Page_PostCommentVO_ OK
     * @throws ApiError
     */
    public static pageUsingGet(
postId: number,
current: number = 1,
pageSize: number = 10,
parentId?: number,
): CancelablePromise<BaseResponse_Page_PostCommentVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post/comment/page',
            query: {
                'current': current,
                'pageSize': pageSize,
                'parentId': parentId,
                'postId': postId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * 根据主键删除帖子评论
     * @param id 帖子评论主键
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static removeUsingDelete(
id: string,
): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/post/comment/remove/{id}',
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
     * 评论帖子
     * @param postCommentRequest 帖子评论
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static saveUsingPost(
postCommentRequest: PostCommentRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post/comment/save',
            body: postCommentRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
