import { HttpClient } from 'src/Agent';
import { RootModel } from 'src/models';
import { BaseService } from './base';
declare type Props = {
    model: RootModel;
    http: HttpClient;
};
export declare class AudioService extends BaseService {
    model: RootModel;
    http: HttpClient;
    constructor(options: Props);
    turnOnMicrophone(): Promise<AnyObject>;
    turnOffMicrophone(): Promise<AnyObject>;
    rejectTurnOnMicrophone(): Promise<AnyObject>;
}
export {};
