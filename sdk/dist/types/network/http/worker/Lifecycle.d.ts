declare enum LifecycleEnum {
    beforeSend = "beforeSend",
    onRequestError = "onRequestError",
    onNetworkError = "onNetworkError",
    onTimeout = "onTimeout",
    onSuccess = "onSuccess"
}
export declare const LifecycleType: {
    BEFORE_SEND: LifecycleEnum;
    REQUEST_ERROR: LifecycleEnum;
    NETWORK_ERROR: LifecycleEnum;
    TIMEOUT: LifecycleEnum;
    SUCCESS: LifecycleEnum;
};
declare type LifecycleOptions = {
    apiList: any[];
    beforeSend: AnyFunction;
    onRequestError: AnyFunction;
    onTimeout: AnyFunction;
    onNetworkError: AnyFunction;
    onSuccess: AnyFunction;
};
declare class Lifecycle {
    beforeSend: AnyFunction;
    onRequestError: AnyFunction;
    onTimeout: AnyFunction;
    onNetworkError: AnyFunction;
    onSuccess: AnyFunction;
    beforeSendBook: {};
    onRequestErrorBook: {};
    onNetworkErrorBook: {};
    onTimeoutBook: {};
    onSuccessBook: {};
    constructor(options: any);
    /**
     * @desc: 初始化生命周期
     * @param {Object} options 初始化配置
     * @param {String} type 生命周期
     * @return {undefined}
     */
    initLifecycleBook(options: LifecycleOptions, type: LifecycleEnum): void;
    /**
     * @desc: 触发生命周期
     * @param { String } type 需要触发的生命周期
     * @param { String } name 需要触发的api的name
     * @param { Object } params http请求的参数
     * @return {undefined}
     */
    triggerLifecycle({ type, name, params, error, result, }: {
        type: LifecycleEnum;
        name: string;
        params: any;
        error?: any;
        result?: any;
    }): void;
}
export default Lifecycle;
