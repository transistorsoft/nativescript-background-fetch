import 'nativescript-tslib';
import "./HeadlessBroadcastReceiver";
import "./HeadlessJobService";
import { AbstractBackgroundFetch } from "./common";
export declare class BackgroundFetch extends AbstractBackgroundFetch {
    private static configured;
    private static isForceReload;
    private static intent;
    static registerHeadlessTask(callback: Function): void;
    static configure(params: any, success: Function, failure?: Function): void;
    static start(success?: Function, failure?: Function): void;
    static stop(success?: Function, failure?: Function): void;
    static finish(result?: number): void;
    static status(success: Function): void;
    private static init;
    private static getAdapter;
}
