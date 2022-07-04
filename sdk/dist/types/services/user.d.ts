import { HttpClient } from 'src/Agent';
import { RootModel } from 'src/models';
import { BaseService } from './base';
declare type Props = {
    http: HttpClient;
    model: RootModel;
};
export declare class UserService extends BaseService {
    http: HttpClient;
    model: RootModel;
    constructor(options: Props);
    registerByPhoneCode(params: {
        code: string;
        encryptedData: string;
        iv: string;
    }): Promise<{
        userId: string;
        displayName: string;
        realName: string;
        avatar: string;
        mobile: string;
    }>;
    login(): Promise<{
        userId: string;
        displayName: string;
        realName: string;
        avatar: string;
        mobile: string;
    } | undefined>;
    getUserInfo(): Promise<{
        userId: string;
        displayName: string;
        realName: string;
        avatar: string;
        mobile: string;
    }>;
    wxLogin(): Promise<WechatMiniprogram.LoginSuccessCallbackResult>;
}
export {};
