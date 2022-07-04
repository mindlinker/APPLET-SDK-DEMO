import { Data } from './data';
import { Config, ApisType } from '../type';
export declare type PassportApi = Config<Data>;
export declare type PassportApiConfig = {
    baseUrl: string;
    apis: ApisType<Data>;
};
