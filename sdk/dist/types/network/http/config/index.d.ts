import { SendConfig } from '../worker/type';
import { PassportApiConfig } from './passport/type';
import { RscApiConfig } from './rsc/type';
import { MeetingApiConfig } from './meeting/type';
import { EimsApiConfig } from './eims/type';
import { UimsApiConfig } from './uims/type';
import { RootModel } from 'models';
import { EventCenter } from 'src/utils/EventCenter';
export declare type allApisConfig = PassportApiConfig['apis'] & RscApiConfig['apis'] & MeetingApiConfig['apis'] & EimsApiConfig['apis'] & UimsApiConfig['apis'];
export interface HttpHelper {
    setClientTokenHeader: (params: SendConfig) => void;
    setfetchClientIdHeader: (params: SendConfig) => void;
    setAccessTokenHeader: (params: SendConfig) => void;
    setEndpointIdHeader: (params: SendConfig) => void;
    setOperator: (params: SendConfig) => void;
}
declare const createConfig: (rootModel: RootModel, eventCenter: EventCenter) => {
    timeout: number;
    isSendTraceId: boolean;
    beforeSend(params: any): void;
    onTimeout(params: any, error: any, result: any): void;
    onSuccess(params: any, error: any, result: any): void;
    onRequestError(params: any, error: any): void;
    apiList: ({
        baseUrl: string;
        apis: import("./type").Config<import("./passport/data").Data>;
    } | {
        baseUrl: string;
        beforeSend(params: any): void;
        apis: import("./type").Config<import("./rsc/data").Data>;
    } | {
        baseUrl: string;
        apis: import("./type").Config<import("./meeting/data").Data>;
        beforeSend(params: any): void;
    } | {
        baseUrl: string;
        beforeSend(params: any): void;
        apis: import("./type").Config<import("./eims/data").Data>;
    } | {
        baseUrl: string;
        beforeSend(params: any): void;
        apis: import("./type").Config<import("./uims/data").Data>;
    })[];
};
export default createConfig;
