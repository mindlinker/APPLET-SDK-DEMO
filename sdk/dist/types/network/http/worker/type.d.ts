/**
 * https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
 * http业务请求，小程序只支持这些method
 */
export declare enum Methods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
export declare type ApiBaseType = {
    path: string;
    method: Methods;
    beforeSend?: (params: SendConfig) => void;
};
export declare type SendConfig = {
    method: Methods;
    url: string;
    data?: {
        [x: string]: any;
    };
    header?: {
        [x: string]: string | number;
    };
    isSendTraceId?: boolean;
    timeout?: number;
};
export declare type ApiType = {
    [x: string]: ApiBaseType & {
        data?: {
            [x: string]: any;
        };
        response: {
            [x: string]: any;
        };
    };
};
export declare type Api = {
    baseUrl: string;
    isSendTraceId?: boolean;
    apis: {
        [x: string]: ApiBaseType;
    };
    beforeSend?: (params: SendConfig) => void;
};
export interface HttpOptions {
    timeout: number;
    isSendTraceId?: boolean;
    apiList: Api[];
}
