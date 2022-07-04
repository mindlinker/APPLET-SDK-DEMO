import { Data } from './data';
import { Config, ApisType } from '../type';
export declare type MeetingApi = Config<Data>;
export declare type MeetingApiConfig = {
    baseUrl: string;
    apis: ApisType<Data>;
};
