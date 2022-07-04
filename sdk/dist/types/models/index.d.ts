import { DefaultConfig } from 'src/config';
export declare class RootModel {
    system: import("./system").SystemModel;
    user: import("./user").UserModel;
    meeting: import("./meeting").MeetingModel;
    init(options: DefaultConfig): Promise<this>;
}
export declare const rootModel: RootModel;
