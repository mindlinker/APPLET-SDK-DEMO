import { Data } from './data';
import { Config, ApisType } from '../type';
export declare type RscApi = Config<Data>;
export declare type RscApiConfig = {
    baseUrl: string;
    apis: ApisType<Data>;
};
