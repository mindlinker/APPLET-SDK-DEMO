import { HttpClient } from 'src/Agent';
import { RootModel } from 'src/models';
import { BaseService } from './base';
declare type Props = {
    model: RootModel;
    http: HttpClient;
};
export declare class MemberService extends BaseService {
    model: RootModel;
    http: HttpClient;
    constructor(options: Props);
    getMeetingList(params?: {
        size: number;
    }): Promise<import("../network/http/config/rsc/data").GetMemberListResponse>;
}
export {};
