import { HttpClient } from 'src/Agent';
import { RootModel } from 'src/models';
import { BaseService } from './base';
declare type Props = {
    model: RootModel;
    http: HttpClient;
};
export declare enum ObserveType {
    ACTIVE_DESKTOP = 0,
    SUBSCRIPTION = 1
}
export declare enum VideoQuality {
    MIN = 360,
    NORMAL = 360,
    HIGH = 1080
}
export declare class StreamService extends BaseService {
    model: RootModel;
    http: HttpClient;
    constructor(options: Props);
    getVideoPullUrl(params: {
        endpointId: string;
        isPresenter: boolean;
    }): Promise<{
        pullUrl: string;
    }>;
    observeMember(params: {
        pullUrl: string;
        endpointId: string;
        isPresenter: boolean;
    }): Promise<{
        pullURL: string;
        UUID: string;
    }[]>;
    unobserveMember(params: {
        pullUrl: string;
        endpointId: string;
    }): Promise<AnyObject>;
}
export {};
