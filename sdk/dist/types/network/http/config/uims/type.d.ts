import { Data } from './data';
import { Config, ApisType } from '../type';
export declare type UimsApi = Config<Data>;
export declare type UimsApiConfig = {
    baseUrl: string;
    apis: ApisType<Data>;
};
