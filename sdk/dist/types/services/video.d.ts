import { HttpClient } from 'src/Agent';
import { RootModel } from 'src/models';
import { BaseService } from './base';
declare type Props = {
    model: RootModel;
    http: HttpClient;
};
export declare class VideoService extends BaseService {
    model: RootModel;
    http: HttpClient;
    constructor(options: Props);
    turnOnCamera(): Promise<AnyObject>;
    turnOffCamera(): Promise<AnyObject>;
    rejectTurnOnCamera(): Promise<AnyObject>;
}
export {};
