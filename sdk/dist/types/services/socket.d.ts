import { HttpClient } from 'src/Agent';
import { RootModel } from 'src/models';
import { BaseService } from './base';
import SocketManager from 'src/network/socket/manager';
import { EventCenter } from 'src/utils/EventCenter';
import { MeetingMode, RoleType } from 'src/models/type';
declare type Props = {
    model: RootModel;
    http: HttpClient;
    eventCenter: EventCenter;
};
declare type Operator = {
    userId: string;
    endpointId: string;
    nickname: string;
};
declare const RoutingKey: {
    /** ------------------------- 会议 ------------------------- */
    /** 关闭会话 */
    readonly CLOSE_ROOM: "meeting.confservice.room.close";
    /** 关闭会话,跟CLOSE_ROOM一样，兼容消息 */
    readonly CLOSE_SESSION: "meeting.confservice.session.close";
    /** 切换会议模式 */
    readonly CHANGE_MODE: "meeting.confservice.room.change_view";
    /** 会议状态改变 */
    readonly OPTIONS_CHANGED: "meeting.confservice.session.options_changed";
    /** 云会议室设置更改 */
    readonly VIRTUAL_CHANGE: "meeting.confservice.virtual_room.update";
    /** 媒体服务挂掉了 */
    readonly MEDIA_SERVER_ERROR: "meeting.confservice.roomendpoint.recovering";
    /** 设置主会场 */
    readonly UPDATE_MAIN_VENUE: "meeting.confservice.session.main_venue_update";
    /** ------------------------- 成员 ------------------------- */
    /** 加入会话 */
    readonly MEMBER_JOIN: "meeting.confservice.room.join";
    /** 退出会议 */
    readonly QUIT_ROOM: "meeting.confservice.roomendpoint.quit_room";
    /** 我被踢出会议 */
    readonly KICK_OUT: "meeting.confservice.roomendpoint.kick_out";
    /** 断线退出 */
    readonly DISCONNECT: "meeting.confservice.roomendpoint.disconnect";
    /** 角色权限更新 */
    readonly UPDATE_MEMBER_ROLE: "meeting.confservice.role.changed";
    /** ------------------------- 视频 ------------------------- */
    /** 邀请打开摄像头 */
    readonly REQUEST_TURN_VIDEO_ON: "meeting.confservice.endpoint.request_turn_on_video";
    /** 关闭视频 */
    readonly CLOSE_VIDEO: "meeting.confservice.roomendpoint.turn_video_off";
    /** 开启视频 */
    readonly OPEN_VIDEO: "meeting.confservice.roomendpoint.turn_video_on";
    /** 主讲人切换 */
    readonly VIDEO_ACTIVE: "meeting.media.endpoint.video.active";
    /** ------------------------- 音频 ------------------------- */
    /** 全体静音 */
    readonly MUTE_ALL: "meeting.confservice.roomendpoint.mute_all";
    /** 邀请开启音频 */
    readonly REQUEST_UNMUTE: "meeting.confservice.media.request_unmute";
    /** 取消端点静音 */
    readonly UNMUTE_MEMBER: "meeting.confservice.roomendpoint.unmute";
    /** 端点静音 */
    readonly MUTE_MEMBER: "meeting.confservice.roomendpoint.mute";
};
export declare class SocketService extends BaseService {
    model: RootModel;
    io: SocketManager | null;
    eventManager: SocketEventManager;
    constructor(options: Props);
    init(): void;
    closeMeetingSocket(): Promise<void>;
    connectMeetingSocket(): Promise<void>;
}
declare type RouterKey = typeof RoutingKey[keyof typeof RoutingKey];
declare type SocketEvent = {
    [x in RouterKey]: (data: AnyObject) => void;
};
interface ISocketEventManager extends SocketEvent {
    io: SocketManager | null;
    eventCenter: EventCenter;
}
declare class SocketEventManager implements ISocketEventManager {
    io: SocketManager | null;
    model: RootModel;
    eventCenter: EventCenter;
    service: SocketService;
    constructor(eventCenter: EventCenter);
    registerSocketEvent(): void;
    [RoutingKey.CHANGE_MODE](data: {
        viewState: MeetingMode;
        presenter: string;
    }): void;
    [RoutingKey.CLOSE_ROOM](data: any): void;
    [RoutingKey.CLOSE_SESSION](data: any): void;
    [RoutingKey.CLOSE_VIDEO](data: {
        roomEndpointId: string;
        operator: Operator;
    }): void;
    [RoutingKey.OPEN_VIDEO](data: {
        roomEndpointId: string;
        operator: Operator;
    }): void;
    [RoutingKey.REQUEST_TURN_VIDEO_ON](): void;
    [RoutingKey.DISCONNECT](data: {
        roomEndpointId: string;
    }): void;
    [RoutingKey.KICK_OUT](): void;
    [RoutingKey.MEDIA_SERVER_ERROR](): void;
    [RoutingKey.UPDATE_MAIN_VENUE](data: {
        endpointId: string;
    }): void;
    [RoutingKey.MEMBER_JOIN](data: {
        lastJoinTime: number;
        nickname: string;
        headImage: string;
        options: {
            isMute: boolean;
            isVideoOff: boolean;
            isSpeakerMute: boolean;
        };
        role: {
            type: RoleType;
        };
        roomEndpointId: string;
        userId: string;
    }): void;
    [RoutingKey.QUIT_ROOM](data: {
        roomEndpointId: string;
    }): void;
    [RoutingKey.MUTE_ALL](data: {
        operator: {
            endpointId: string;
            nickname: string;
            userId: string;
        };
    }): void;
    [RoutingKey.MUTE_MEMBER](data: {
        roomEndpointId: string;
        operator: Operator;
    }): void;
    [RoutingKey.UNMUTE_MEMBER](data: {
        roomEndpointId: string;
        operator: Operator;
    }): void;
    [RoutingKey.OPTIONS_CHANGED](data: {
        operator: Operator;
        options: {
            unmuteSelfEnabled?: boolean;
            locked?: boolean;
            muted?: boolean;
            turnOnVideoSelfEnabled?: boolean;
        };
    }): void;
    [RoutingKey.REQUEST_UNMUTE](): void;
    [RoutingKey.UPDATE_MEMBER_ROLE](data: {
        endpointId: string;
        type: RoleType;
        userId: string;
    }[]): void;
    [RoutingKey.VIRTUAL_CHANGE](data: {
        name?: {
            newValue: string;
            oldValue: string;
        };
        code?: {
            newValue: string;
            oldValue: string;
        };
        password?: {
            newValue: string;
            oldValue: string;
        };
    }): void;
    [RoutingKey.VIDEO_ACTIVE](data: {
        endpointIds: string[];
    }): void;
}
export {};
