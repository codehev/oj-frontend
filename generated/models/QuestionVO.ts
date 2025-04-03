/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JudgeConfig } from './JudgeConfig';
import type { UserProfileVO } from './UserProfileVO';

export type QuestionVO = {
    acceptedNum?: number;
    content?: string;
    createTime?: string;
    difficulty?: number;
    difficultyString?: string;
    favourNum?: number;
    hasFavour?: boolean;
    hasThumb?: boolean;
    id?: number;
    judgeConfig?: JudgeConfig;
    number?: string;
    submitNum?: number;
    tags?: Array<string>;
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    userId?: number;
    userProfileVO?: UserProfileVO;
};
