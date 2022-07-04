import { Methods } from './type';
export declare type SendConfig = {
    method: Methods;
    url: string;
    data?: AnyObject;
    header?: AnyObject;
    isSendTraceId?: boolean;
    timeout?: number;
};
declare class Request {
    timeout: number;
    constructor(options: any);
    send(config: SendConfig): Promise<WechatMiniprogram.RequestSuccessCallbackResult<string | WechatMiniprogram.IAnyObject | ArrayBuffer>>;
    generateConfig(config: SendConfig): SendConfig;
}
export default Request;
