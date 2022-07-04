export declare type Data = {
    getClientToken: {
        response: {
            access_token: string;
        };
        data: {
            state: string;
        };
    };
    getUserToken: {
        response: {
            access_token: string;
            deviceType: string;
            refresh_token: string;
            accountId: number;
            code: number;
            deviceSerialNo: string;
            openId: string;
            appKey: string;
            state: string;
            token_type: string;
            expires_in: number;
            userId: string;
        };
        data: {
            code: string;
        };
    };
    bindWechatAccount: {
        response: {
            access_token: string;
            deviceType: string;
            refresh_token: string;
            accountId: number;
            code: number;
            deviceSerialNo: string;
            openId: string;
            appKey: string;
            token_type: string;
            expires_in: number;
            userId: string;
        };
        data: {
            code: string;
            encryptedData: string;
            iv: string;
        };
    };
};
