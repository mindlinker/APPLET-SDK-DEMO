import { HttpClient } from 'src/Agent';
import { RootModel } from 'src/models';
import { BaseService } from './base';
declare type Props = {
    model: RootModel;
    http: HttpClient;
};
export declare class SystemService extends BaseService {
    model: RootModel;
    http: HttpClient;
    constructor(options: Props);
    init(): Promise<void>;
}
export {};
