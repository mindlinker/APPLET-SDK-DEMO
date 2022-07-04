import { Data } from './data';
import { Config, ApisType } from '../type';
export declare type EimsApi = Config<Data>;
export declare type EimsApiConfig = {
    baseUrl: string;
    apis: ApisType<Data>;
};
