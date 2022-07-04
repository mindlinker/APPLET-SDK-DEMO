import { RoleType, PlatformType, MeetingMode, RecordStatus } from 'models/type';
export declare type JoinMeetingResponse = {
    endpoint: {
        id: string;
        isAudioMute: boolean;
        isVideoMute: boolean;
        role: {
            type: RoleType;
        };
    };
    serverOpts: {
        /** 推流地址 */
        pushUrl: string;
        /** 音频拉流地址 */
        audioPullUrl: string;
    };
    session: {
        id: string;
        code: string;
        mainVenueId: null | string;
        owner: {
            userId: string;
            deviceId: string;
        };
        password: null | string;
        topic: string;
        createdTime: number;
        options: {
            locked: boolean;
            unmuteSelfEnabled: boolean;
            muted: boolean;
        };
        mode: {
            viewState: MeetingMode;
            presenter: string;
            state: number;
            settings?: {
                requireWatermark: boolean;
            };
        };
    };
};
declare type JoinMeetingParams = {
    mediaOpts: {
        /** 小程序这里固定为空 */
        sdp: string;
        isAudioMute: boolean;
        isVideoMute: boolean;
    };
    endpointInfo: {
        nickname: string;
        headImage: string;
        deviceSn: string;
        /** 这里固定为小程序 */
        platform: number;
        /** 是否为快速入会 */
        isFastRecovery?: boolean;
    };
    sessionInfo: {
        code: string;
        description?: string;
        password?: string;
        ticket?: string;
    };
};
export declare type GetMemberListResponse = {
    data: {
        deviceId: null | string;
        headImage: string;
        /** endpointId */
        id: string;
        isAudioMute: boolean;
        isVideoMute: boolean;
        isSpeakerMute: boolean;
        isSpeakRequest: boolean;
        lastJoinTime: number;
        nickname: string;
        platform: PlatformType;
        role: {
            type: RoleType;
        };
        userId: string;
    }[];
};
export declare type GetMeetingInfoResponse = {
    id: string;
    code: string;
    topic: string;
    mainVenueId: string;
    options: {
        locked: boolean;
        unmuteSelfEnabled: boolean;
        muted: boolean;
    };
    mode: {
        viewState: MeetingMode;
        presenter: string;
    };
    recordInfo: {
        status: RecordStatus;
    };
    password: null | string;
};
export declare type Data = {
    joinMeeting: {
        response: JoinMeetingResponse;
        data: JoinMeetingParams;
    };
    getMeetingInfo: {
        response: GetMeetingInfoResponse;
        data: {
            sessionId: string;
        };
    };
    getMemberList: {
        response: GetMemberListResponse;
        data: {
            sessionId: string;
            size: number;
            lastJoinTime?: number;
        };
    };
    muteMember: {
        response: AnyObject;
        data: {
            sessionId: string;
            endpointId: string;
        };
    };
    unmuteMember: {
        response: AnyObject;
        data: {
            sessionId: string;
            endpointId: string;
        };
    };
    turnVideoOff: {
        response: AnyObject;
        data: {
            sessionId: string;
            endpointId: string;
        };
    };
    turnVideoOn: {
        response: AnyObject;
        data: {
            sessionId: string;
            endpointId: string;
        };
    };
    observeVideo: {
        response: {
            pullURL: string;
            UUID: string;
        }[];
        data: {
            sessionId: string;
            endpointId: string;
            UUID: string;
            wechatURL: string;
        };
    };
    unobserveVideo: {
        response: AnyObject;
        data: {
            sessionId: string;
            endpointId: string;
            pullURL: string;
        };
    };
    getVideoPullUrl: {
        response: {
            pullURL: string;
            UUID: string;
        }[];
        data: {
            sessionId: string;
            UUID: string;
        };
    };
    getSipsInfo: {
        response: {
            _id: string;
            serviceName: string;
            publicIp: string;
            privateIp: string;
        }[];
        data: {
            code: string;
        };
    };
    rejectUnmute: {
        response: AnyObject;
        data: {
            sessionId: string;
            endpointId: string;
        };
    };
    leaveMeeting: {
        response: AnyObject;
        data: {
            sessionId: string;
            endpointId: string;
        };
    };
    handUp: {
        response: AnyObject;
        data: {
            endpointId: string;
            sessionId: string;
        };
    };
    handDown: {
        response: AnyObject;
        data: {
            endpointId: string;
            sessionId: string;
        };
    };
    rejectUnmuteVideo: {
        response: AnyObject;
        data: {
            sessionId: string;
        };
    };
    modifyMemberName: {
        response: AnyObject;
        data: {
            endpointId: string;
            sessionId: string;
            nickname: string;
        };
    };
};
export {};
