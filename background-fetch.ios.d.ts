export declare class BackgroundFetch {
    private static configured;
    static performFetchWithCompletionHandler(application: UIApplication, completionHandler: Function): void;
    static configure(config: Object, callback: Function, failure?: Function): void;
    static start(success?: Function, failure?: Function): void;
    static stop(success?: Function, failure?: Function): void;
    static status(success: Function): void;
    static finish(result?: UIBackgroundFetchResult): void;
}
