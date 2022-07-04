import { ApiBaseType } from '../worker/type';
export declare type Config<T> = {
    [x in keyof T]: ApiBaseType;
};
export declare type ApisType<T extends dataType> = {
    [x in keyof T]: ApiBaseType & {
        response: T[x]['response'];
        data?: T[x]['data'];
    };
};
export declare type HttpApiType = {
    response: AnyObject;
    data?: AnyObject;
};
export declare type dataType = {
    [x: string]: HttpApiType;
};
