/**
 * @desc: 创建一个uuid
 * @param {boolean} isReplace 是否需要删除掉横杠
 * @return {String} uuid
 */
export declare const createUUID: (isReplace?: boolean) => string;
/**
 * @desc: 将url上的参数替换成data的相应值
 * @param {String} url 需要替换的url
 * @param {Object} data 替换的数据源
 * @return {String} 替换完成的url
 */
export declare const replaceUrlParams: (url: string, data?: {
    [x: string]: any;
} | undefined) => string;
export declare function object2UrlParams(obj: {
    [x: string]: string | number;
}): string;
export declare function arraytoMapState(arr: any[]): any;
/**
 * 微信error风格的error封装
 */
export declare class CommonError extends Error {
    constructor(code: number, displayText: string, message: any);
    data: {
        code: number;
        displayText: string;
        message: string;
    };
    errMsg: '';
}
export declare function timestamp2HourMinute(timestamp: number): {
    hour: number;
    minute: number;
};
export declare function getErrorCode(error: any): any;
export declare function delay(time: number): Promise<unknown>;
declare const _default: {
    createUUID: (isReplace?: boolean | undefined) => string;
    replaceUrlParams: (url: string, data?: {
        [x: string]: any;
    } | undefined) => string;
    object2UrlParams: typeof object2UrlParams;
    arraytoMapState: typeof arraytoMapState;
    timestamp2HourMinute: typeof timestamp2HourMinute;
    getErrorCode: typeof getErrorCode;
    delay: typeof delay;
};
export default _default;
