export declare class BackgroundFetch {
    private fetchManager;
    private configured;
    constructor();
    configure(config: any, callback: any, failure: any): void;
    finish(result: any): void;
}
