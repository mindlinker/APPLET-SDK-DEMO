export declare type SystemModelProps = {
    serverUrl: string;
};
export declare class SystemModel {
    state: {
        /** apiproxy 地址 */
        serverUrl: string;
        /** 请求客户端token的header */
        clientHeader: string;
        clientToken: string;
        systemInfo: {
            system: string;
        };
        deviceId: string;
    };
    init(options: SystemModelProps): Promise<void>;
    private getDeviceId;
    private getSystemInfo;
    get clientToken(): string;
    get clientHeader(): string;
    get passportUrl(): string;
    get rscUrl(): string;
    get meetingUrl(): string;
    get eimsUrl(): string;
    get uimsUrl(): string;
}
export declare const systemModel: SystemModel;
