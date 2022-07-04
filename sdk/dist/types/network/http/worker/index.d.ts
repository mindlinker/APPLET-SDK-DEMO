import Lifecycle from './Lifecycle';
import Request from './Request';
import { HttpOptions, ApiType } from './type';
declare class Http<Options extends HttpOptions> {
    request: Request;
    lifecycle: Lifecycle;
    options: Options;
    constructor(options: Options);
    createApis<T extends ApiType>(): {
        [x in keyof T]: (data?: T[x]['data'], config?: {
            header?: {
                [x: string]: any;
            };
        }) => T[x]['response'];
    };
    handleError({ error, params, name, }: {
        error: any;
        params: any;
        name: any;
    }): Promise<void>;
}
export default Http;
