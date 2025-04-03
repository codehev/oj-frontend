/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PostZone } from './PostZone';
import type { UserProfileVO } from './UserProfileVO';

export type PostVO = {
    content?: string;
    createTime?: string;
    favourNum?: number;
    hasFavour?: boolean;
    hasThumb?: boolean;
    id?: number;
    postZone?: PostZone;
    tagList?: Array<string>;
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    userId?: number;
    userProfileVO?: UserProfileVO;
    viewNum?: number;
    zoneId?: number;
};
