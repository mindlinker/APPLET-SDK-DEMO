import { HttpClient } from 'src/Agent';
import { RootModel } from 'src/models';
import { BaseService } from './base';
declare type Props = {
    model: RootModel;
    http: HttpClient;
};
export declare class MeetingService extends BaseService {
    model: RootModel;
    http: HttpClient;
    constructor(options: Props);
    joinMeeting(params: {
        code: string;
        password?: string;
        turnOnMicrophone: boolean;
        turnOnCamera: boolean;
        name?: string;
        avatar?: string;
    }): Promise<import("../network/http/config/rsc/data").JoinMeetingResponse>;
    quitMeeting(): Promise<AnyObject | undefined>;
    getMeetingInfo(): Promise<import("../network/http/config/rsc/data").GetMeetingInfoResponse>;
}
export {};
