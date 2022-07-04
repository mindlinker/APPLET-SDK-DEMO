export declare type Data = {
    getShareUrl: {
        response: {
            url: string;
            expireIn: number;
            expireTime: number;
        };
        data: {
            payload: string;
        };
    };
    getParamsByPayloadId: {
        response: {
            payload: string;
        };
        data: {};
    };
};
