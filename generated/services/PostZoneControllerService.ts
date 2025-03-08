/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_PostZoneVO_ } from '../models/BaseResponse_List_PostZoneVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_PostZoneVO_ } from '../models/BaseResponse_Page_PostZoneVO_';
import type { BaseResponse_PostZone_ } from '../models/BaseResponse_PostZone_';
import type { BaseResponse_PostZoneVO_ } from '../models/BaseResponse_PostZoneVO_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { PostZoneAddRequest } from '../models/PostZoneAddRequest';
import type { PostZoneUpdateRequest } from '../models/PostZoneUpdateRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PostZoneControllerService {

    /**
     * addPostZone
     * @param postZoneAddRequest postZoneAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addPostZoneUsingPost(
postZoneAddRequest: PostZoneAddRequest,
): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_zone/add',
            body: postZoneAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * deletePostZone
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deletePostZoneUsingPost(
deleteRequest: DeleteRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_zone/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getPostZoneById
     * @param id id
     * @returns BaseResponse_PostZone_ OK
     * @throws ApiError
     */
    public static getPostZoneByIdUsingGet(
id?: number,
): CancelablePromise<BaseResponse_PostZone_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post_zone/get',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getPostZoneVOById
     * @param id id
     * @returns BaseResponse_PostZoneVO_ OK
     * @throws ApiError
     */
    public static getPostZoneVoByIdUsingGet(
id?: number,
): CancelablePromise<BaseResponse_PostZoneVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post_zone/get/vo',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listPostZone
     * @param current 
     * @param id 
     * @param pageSize 
     * @param sortField 
     * @param sortOrder 
     * @param userId 
     * @param zoneName 
     * @returns BaseResponse_List_PostZoneVO_ OK
     * @throws ApiError
     */
    public static listPostZoneUsingGet(
current?: number,
id?: number,
pageSize?: number,
sortField?: string,
sortOrder?: string,
userId?: number,
zoneName?: string,
): CancelablePromise<BaseResponse_List_PostZoneVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post_zone/list',
            query: {
                'current': current,
                'id': id,
                'pageSize': pageSize,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'userId': userId,
                'zoneName': zoneName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listPostZoneByPage
     * @param current 
     * @param id 
     * @param pageSize 
     * @param sortField 
     * @param sortOrder 
     * @param userId 
     * @param zoneName 
     * @returns BaseResponse_Page_PostZoneVO_ OK
     * @throws ApiError
     */
    public static listPostZoneByPageUsingGet(
current?: number,
id?: number,
pageSize?: number,
sortField?: string,
sortOrder?: string,
userId?: number,
zoneName?: string,
): CancelablePromise<BaseResponse_Page_PostZoneVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/post_zone/list/page',
            query: {
                'current': current,
                'id': id,
                'pageSize': pageSize,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'userId': userId,
                'zoneName': zoneName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * updatePostZone
     * @param postZoneUpdateRequest postZoneUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updatePostZoneUsingPost(
postZoneUpdateRequest: PostZoneUpdateRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/post_zone/update',
            body: postZoneUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
