export declare class BackgroundFetch {
    static FETCH_RESULT_NEW_DATA: number;
    static FETCH_RESULT_NO_DATA: number;
    static FETCH_RESULT_FAILED: number;
    private static configured;
    static configure(config?: Object, callback?: Function, failure?: Function): void;
    static start(success?: Function, failure?: Function): void;
    static stop(success?: Function, failure?: Function): void;
    static finish(result?: number): void;
}
