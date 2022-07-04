import Engine, { EngineProps } from './engine';
export declare type SocketManagerOptions = EngineProps & {
    connectRetryTime?: number;
    maxRetryTimes?: number;
};
declare class SocketManager {
    socket: Engine;
    options: EngineProps;
    /** 已经重试过的次数 */
    retryTime: number;
    /** 最多重试的次数 */
    maxRetryTimes: number;
    connectRetryTime: number;
    messageFunc: AnyFunction[];
    openFunc: AnyFunction[];
    errorFunc: AnyFunction[];
    closeFunc: AnyFunction[];
    reconnectFunc: AnyFunction[];
    reconnectingFunc: AnyFunction[];
    reconnectFailFunc: AnyFunction[];
    constructor(options: SocketManagerOptions);
    close(): Promise<void>;
    connect(isRetry?: boolean): Promise<this>;
    registerReconnect(isRetry?: boolean): Promise<void>;
    delay(timeout: number): Promise<unknown>;
    onError(func: AnyFunction): void;
    onOpen(func: AnyFunction): void;
    onClose(func: AnyFunction): void;
    onMessage(func: AnyFunction): void;
    onReconnecting(func: AnyFunction): void;
    onReconnectFail(func: AnyFunction): void;
    onReconnect(func: AnyFunction): void;
    checkSocketHealth(): Promise<boolean>;
    send(msg: string): void;
}
export default SocketManager;
