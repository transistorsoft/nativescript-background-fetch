import {AbstractBackgroundFetch} from "./common";

declare var TSBackgroundFetch: any;

let TAG = "NSBackgroundFetch";

var emptyFn = function() {};

export class BackgroundFetch extends AbstractBackgroundFetch {
  private static configured: boolean;

  public static performFetchWithCompletionHandler(completionHandler:Function, state:UIApplicationState, ) {
    TSBackgroundFetch.sharedInstance().performFetchWithCompletionHandlerApplicationState(completionHandler, state);
  }

  public static configure(config:Object, callback:Function, failure?:Function) {
    let fetchManager = TSBackgroundFetch.sharedInstance();

    fetchManager.configureCallback(config, (status:UIBackgroundRefreshStatus) => {
      if (status != UIBackgroundRefreshStatus.Available) {
        console.warn(TAG, "failed to start TSBackgroundFetch");
        failure(status);
        return;
      }
      this.configured = true;
      fetchManager.addListenerCallback(TAG, callback);
      fetchManager.start();
    });
  }
  public static start(success?:Function, failure?:Function) {
    success = success || emptyFn;
    failure = failure || emptyFn;

    TSBackgroundFetch.sharedInstance().start((status:UIBackgroundRefreshStatus) => {
      if (status == UIBackgroundRefreshStatus.Available) {
        success();
      } else {
        console.warn(TAG, "failed to start TSBackgroundFetch");
        failure(status);
      }
    });
  }

  public static stop(success?:Function, failure?:Function) {
    success = success || emptyFn;
    failure = failure || emptyFn;

    TSBackgroundFetch.sharedInstance().stop();
    success();
  }

  public static status(success:Function) {
    TSBackgroundFetch.sharedInstance().status((status:UIBackgroundRefreshStatus) => {
      success(status);
    });
  }

  public static finish(result?:number) {
    result = result || this.FETCH_RESULT_NO_DATA;
    TSBackgroundFetch.sharedInstance().finishResult(TAG, result);
  }

  // Note: Android-only
  public static registerHeadlessTask(callback:Function) {}

}