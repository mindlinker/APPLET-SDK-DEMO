declare type EventMap = {
    [key: string]: AnyFunction[];
};
export declare class EventCenter {
    eventMap: EventMap;
    on(name: string, handler: AnyFunction): void;
    off(name: string, handler: AnyFunction | null, offAll?: boolean): void;
    emit(name: string, ...args: any[]): void;
}
export {};
