export declare type UserInfo = {
    displayName: string;
    mobile: string;
    email: string;
    gender: 0 | 1;
    birthYear: string;
    birthMonth: string;
    birthDay: string;
    province: string;
    city: string;
    district: string;
    avatar: string;
    userAgreementVersion: string;
    privacyVersion: string;
    mobileAreaCode: string;
    country: string;
};
export declare type Data = {
    updateUserInfo: {
        response: {
            id: string;
            displayName: string;
        };
        data: {};
    };
};
