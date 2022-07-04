import { HttpHelper } from '../index';
declare const _default: (baseUrl: string, helper: HttpHelper) => {
    baseUrl: string;
    apis: import("../type").Config<import("./data").Data>;
    beforeSend(params: any): void;
};
export default _default;
