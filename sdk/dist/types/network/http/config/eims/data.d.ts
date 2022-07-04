export declare enum StaffRole {
    SUPER = 21,
    ADMIN = 22,
    STAFF = 23
}
export declare type UserInfo = {
    displayName: string;
    mobile: string;
    email: string;
    birthYear: string;
    birthMonth: string;
    birthDay: string;
    passwordRuleType: 1;
    avatar: string;
    unionid: string;
    openid: string;
    gender: 1 | 0;
    province: string;
    city: string;
    country: string;
    createdDate: number;
    updatedDate: number;
    admin: boolean;
    contactId: string;
    id: string;
    userAgreementVersion: number;
    privacyVersion: number;
};
export declare type CompanyUserInfo = {
    userId: string;
    mobile: string;
    email: string;
    jobTitle: string;
    realName: string;
    state: number;
    staffNo: string;
    departmentId: string;
    activationState: string;
    companyName: string;
    shortName: string;
    companyId: string;
    companyCode: string;
    type: number;
    remark: string;
    avatar: string;
    count: number;
    country: string;
    province: string;
    city: string;
    district: string;
    address: string;
    staffId: string;
    department: string;
    adminName: string;
    adminMobile: string;
};
export declare type Data = {
    getUserInfo: {
        response: UserInfo & {
            userId: string;
            company: CompanyUserInfo;
        };
        data?: AnyObject;
    };
    createCompany: {
        response: {
            code: '';
            name: '';
            companyId: '';
            staffId: '';
        };
        data: {
            name: string;
            country: string;
            province: string;
            city: string;
            district: string;
            scale: string;
            industryCode: string;
        };
    };
};
