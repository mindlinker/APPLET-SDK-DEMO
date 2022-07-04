import { initHttpClient } from './network/http';
import { MeetingService } from './services/meeting';
import { MemberService } from './services/member';
import { StreamService } from './services/stream';
import { UserService } from './services/user';
export interface AppOptions {
    serverUrl: string;
}
export declare type HttpClient = ReturnType<typeof initHttpClient>;
export declare enum MEETING_EVENT {
    MEMBER_UPDATE = "MEMBER_UPDATE",
    MEMBER_QUIT = "MEMBER_QUIT",
    MEMBER_JOIN = "MEMBER_JOIN",
    MUTE_ALL = "MUTE_ALL",
    REQUEST_TURN_ON_CAMERA = "REQUEST_TURN_ON_CAMERA",
    REQUEST_TURN_ON_MICROPHONE = "REQUEST_TURN_ON_MICROPHONE",
    MEETING_INFO_UPDATE = "MEETING_INFO_UPDATE",
    MODE_UPDATE = "MODE_UPDATE",
    MEETING_END = "MEETING_END",
    KICK_OUT = "KICK_OUT",
    MEDIA_SERVER_ERROR = "MEDIA_SERVER_ERROR",
    DISCONNECT = "DISCONNECT",
    MAIN_VENUE_UPDATE = "MAIN_VENUE_UPDATE",
    ACTIVE_MEMBER_UPDATE = "ACTIVE_MEMBER_UPDATE",
    OPTIONS_CHANGED = "OPTIONS_CHANGED"
}
export declare const MEETING_EVENT_KEY = "MEETING_EVENT";
export declare class Agent {
    private _system;
    private _user;
    private _member;
    private _audio;
    private _video;
    private _meeting;
    private _stream;
    private _socket;
    private rootModel;
    private httpClient;
    private eventCenter;
    init(options: AppOptions): Promise<void>;
    private quitMeetingInside;
    private initSystem;
    private get user();
    private get meeting();
    private get socket();
    private get member();
    private get video();
    private get audio();
    private get stream();
    registerByPhoneCode(params: Parameters<UserService['registerByPhoneCode']>[0]): Promise<{
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
    joinMeeting(params: Parameters<MeetingService['joinMeeting']>[0]): Promise<import("./network/http/config/rsc/data").JoinMeetingResponse>;
    quitMeeting(): Promise<AnyObject | undefined>;
    getMeetingInfo(): Promise<import("./network/http/config/rsc/data").GetMeetingInfoResponse>;
    getMemberList(params: Parameters<MemberService['getMeetingList']>[0]): Promise<import("./network/http/config/rsc/data").GetMemberListResponse>;
    turnOnMicrophone(): Promise<AnyObject>;
    turnOffMicrophone(): Promise<AnyObject>;
    rejectTurnOnMicrophone(): Promise<AnyObject>;
    turnOnCamera(): Promise<AnyObject>;
    turnOffCamera(): Promise<AnyObject>;
    rejectTurnOnCamera(): Promise<AnyObject>;
    getVideoPullUrl(params: Parameters<StreamService['getVideoPullUrl']>[0]): Promise<{
        pullUrl: string;
    }>;
    observeMember(params: Parameters<StreamService['observeMember']>[0]): Promise<{
        pullURL: string;
        UUID: string;
    }[]>;
    unobserveMember(params: Parameters<StreamService['unobserveMember']>[0]): Promise<AnyObject>;
    onMessage(func: (e: {
        key: MEETING_EVENT;
        data: any;
    }) => any): void;
}
