import { AbstractBackgroundFetch } from "./common";
export declare class BackgroundFetch extends AbstractBackgroundFetch {
    private static configured;
    static performFetchWithCompletionHandler(completionHandler: Function, state: UIApplicationState): void;
    static configure(config: Object, callback: Function, failure?: Function): void;
    static start(success?: Function, failure?: Function): void;
    static stop(success?: Function, failure?: Function): void;
    static status(success: Function): void;
    static finish(result?: number): void;
    static registerHeadlessTask(callback: Function): void;
}
