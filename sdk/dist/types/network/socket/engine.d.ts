declare type SocketConfig = {
    sid?: string;
    upgrades?: any[];
    pingInterval: number;
    pingTimeout?: number;
};
export declare type EngineProps = {
    baseUrl: string;
    namespace: string[];
    pingInterval?: number;
    baseQuery: {
        [x: string]: string | number;
    };
    query: {
        [x: string]: {
            [x: string]: string | number;
        };
    };
};
declare class Engine {
    baseQueryString: string;
    queryStringObj: {
        [x: string]: string;
    };
    url: string;
    namespace: string[];
    socketConfig: SocketConfig;
    socketPingPong: any;
    socketInstance: WechatMiniprogram.SocketTask | null;
    constructor(options: EngineProps);
    connect(): Promise<WechatMiniprogram.SocketTask>;
    generateMessage(res: WechatMiniprogram.SocketTaskOnMessageCallbackResult): string | {
        id: string | null;
        data: any;
    } | undefined;
    send(msg: string): void;
    destory(): Promise<unknown>;
    onClose(func: (res: {
        code: number;
        reason: string;
    }) => void): void;
    onOpen(func: (...args: any[]) => void): void;
    onError(func: (...args: any[]) => void): void;
    onMessage: (func: (...args: any[]) => void) => void;
}
export default Engine;
