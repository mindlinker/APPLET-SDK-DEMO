export declare class UserModel {
    state: {
        userToken: string;
        userInfo: {
            userId: string;
            displayName: string;
            realName: string;
            avatar: string;
            mobile: string;
        };
    };
    saveUserToken(token: string): void;
    get userToken(): string;
}
export declare const userModel: UserModel;
