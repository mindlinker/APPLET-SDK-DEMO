import { RootModel } from 'src/models';
import { EventCenter } from 'src/utils/EventCenter';
export declare const initHttpClient: (rootModel: RootModel, eventCenter: EventCenter) => {
    getClientToken: (data?: {
        state: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => {
        access_token: string;
    };
    getUserToken: (data?: {
        code: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => {
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
    bindWechatAccount: (data?: {
        code: string;
        encryptedData: string;
        iv: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => {
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
    joinMeeting: (data?: {
        mediaOpts: {
            sdp: string;
            isAudioMute: boolean;
            isVideoMute: boolean;
        };
        endpointInfo: {
            nickname: string;
            headImage: string;
            deviceSn: string;
            platform: number;
            isFastRecovery?: boolean | undefined;
        };
        sessionInfo: {
            code: string;
            description?: string | undefined;
            password?: string | undefined;
            ticket?: string | undefined;
        };
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => import("./config/rsc/data").JoinMeetingResponse;
    getMeetingInfo: (data?: {
        sessionId: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => import("./config/rsc/data").GetMeetingInfoResponse;
    getMemberList: (data?: {
        sessionId: string;
        size: number;
        lastJoinTime?: number | undefined;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => import("./config/rsc/data").GetMemberListResponse;
    muteMember: (data?: {
        sessionId: string;
        endpointId: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => AnyObject;
    unmuteMember: (data?: {
        sessionId: string;
        endpointId: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => AnyObject;
    turnVideoOff: (data?: {
        sessionId: string;
        endpointId: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => AnyObject;
    turnVideoOn: (data?: {
        sessionId: string;
        endpointId: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => AnyObject;
    observeVideo: (data?: {
        sessionId: string;
        endpointId: string;
        UUID: string;
        wechatURL: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => {
        pullURL: string;
        UUID: string;
    }[];
    unobserveVideo: (data?: {
        sessionId: string;
        endpointId: string;
        pullURL: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => AnyObject;
    getVideoPullUrl: (data?: {
        sessionId: string;
        UUID: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => {
        pullURL: string;
        UUID: string;
    }[];
    getSipsInfo: (data?: {
        code: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => {
        _id: string;
        serviceName: string;
        publicIp: string;
        privateIp: string;
    }[];
    rejectUnmute: (data?: {
        sessionId: string;
        endpointId: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => AnyObject;
    leaveMeeting: (data?: {
        sessionId: string;
        endpointId: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => AnyObject;
    handUp: (data?: {
        endpointId: string;
        sessionId: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => AnyObject;
    handDown: (data?: {
        endpointId: string;
        sessionId: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => AnyObject;
    rejectUnmuteVideo: (data?: {
        sessionId: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => AnyObject;
    modifyMemberName: (data?: {
        endpointId: string;
        sessionId: string;
        nickname: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => AnyObject;
    getShareUrl: (data?: {
        payload: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => {
        url: string;
        expireIn: number;
        expireTime: number;
    };
    getParamsByPayloadId: (data?: {} | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => {
        payload: string;
    };
    getUserInfo: (data?: AnyObject | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => import("./config/eims/data").UserInfo & {
        userId: string;
        company: import("./config/eims/data").CompanyUserInfo;
    };
    createCompany: (data?: {
        name: string;
        country: string;
        province: string;
        city: string;
        district: string;
        scale: string;
        industryCode: string;
    } | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => {
        code: "";
        name: "";
        companyId: "";
        staffId: "";
    };
    updateUserInfo: (data?: {} | undefined, config?: {
        header?: {
            [x: string]: any;
        } | undefined;
    } | undefined) => {
        id: string;
        displayName: string;
    };
};
