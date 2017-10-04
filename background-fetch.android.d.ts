export declare class BackgroundFetch {
    private static configured;
    static configure(config?: Object, callback?: Function, failure?: Function): void;
    static start(success?: Function, failure?: Function): void;
    static stop(success?: Function, failure?: Function): void;
    static finish(result?: number): void;
    static status(success: Function): void;
}
