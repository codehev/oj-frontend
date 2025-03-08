/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_string_ } from '../models/BaseResponse_string_';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FileControllerService {

    /**
     * downloadFromMinio
     * @param objectName objectName
     * @returns any OK
     * @throws ApiError
     */
    public static downloadFromMinioUsingGet(
objectName?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/file/downloadMinio',
            query: {
                'objectName': objectName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * downloadFromMinio
     * @param objectName objectName
     * @returns any OK
     * @throws ApiError
     */
    public static downloadFromMinioUsingHead(
objectName?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'HEAD',
            url: '/api/file/downloadMinio',
            query: {
                'objectName': objectName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * downloadFromMinio
     * @param objectName objectName
     * @returns any OK
     * @throws ApiError
     */
    public static downloadFromMinioUsingPost(
objectName?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/file/downloadMinio',
            query: {
                'objectName': objectName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * downloadFromMinio
     * @param objectName objectName
     * @returns any OK
     * @throws ApiError
     */
    public static downloadFromMinioUsingPut(
objectName?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/file/downloadMinio',
            query: {
                'objectName': objectName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * downloadFromMinio
     * @param objectName objectName
     * @returns any OK
     * @throws ApiError
     */
    public static downloadFromMinioUsingDelete(
objectName?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/file/downloadMinio',
            query: {
                'objectName': objectName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * downloadFromMinio
     * @param objectName objectName
     * @returns any OK
     * @throws ApiError
     */
    public static downloadFromMinioUsingOptions(
objectName?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'OPTIONS',
            url: '/api/file/downloadMinio',
            query: {
                'objectName': objectName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * downloadFromMinio
     * @param objectName objectName
     * @returns any OK
     * @throws ApiError
     */
    public static downloadFromMinioUsingPatch(
objectName?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/file/downloadMinio',
            query: {
                'objectName': objectName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * uploadFile
     * @param biz 
     * @param file 
     * @returns BaseResponse_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static uploadFileUsingPost(
biz?: string,
file?: Blob,
): CancelablePromise<BaseResponse_string_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/file/upload',
            query: {
                'biz': biz,
            },
            formData: {
                'file': file,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * uploadFileToMinio
     * @param biz biz
     * @param file 
     * @param fileName fileName
     * @returns BaseResponse_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static uploadFileToMinioUsingPost(
biz?: string,
file?: Blob,
fileName?: string,
): CancelablePromise<BaseResponse_string_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/file/uploadMinio',
            query: {
                'biz': biz,
                'fileName': fileName,
            },
            formData: {
                'file': file,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
