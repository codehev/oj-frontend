/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_string_ } from '../models/BaseResponse_string_';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OAuthControllerService {

    /**
     * renderAuth
     * @param source source
     * @returns BaseResponse_string_ OK
     * @throws ApiError
     */
    public static renderAuthUsingGet(
source: string,
): CancelablePromise<BaseResponse_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/oauth/render/{source}',
            path: {
                'source': source,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * login
     * @param source source
     * @param authCode 
     * @param authorizationCode 
     * @param code 
     * @param oauthToken 
     * @param oauthVerifier 
     * @param state 
     * @returns any OK
     * @throws ApiError
     */
    public static loginUsingGet(
source: string,
authCode?: string,
authorizationCode?: string,
code?: string,
oauthToken?: string,
oauthVerifier?: string,
state?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/oauth/{source}/callback',
            path: {
                'source': source,
            },
            query: {
                'auth_code': authCode,
                'authorization_code': authorizationCode,
                'code': code,
                'oauth_token': oauthToken,
                'oauth_verifier': oauthVerifier,
                'state': state,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
