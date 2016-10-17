declare var TSBackgroundFetch: any;
declare var UIBackgroundFetchResultNewData;
declare var UIBackgroundFetchResultNoData;
declare var UIBackgroundFetchResultFailed;

let TAG = "NSBackgroundFetch";

var emptyFn = function() {};

export class BackgroundFetch {
  public static FETCH_RESULT_NEW_DATA = 0;
  public static FETCH_RESULT_NO_DATA = 1;
  public static FETCH_RESULT_FAILED = 2;

  private static configured: boolean;

  public static performFetchWithCompletionHandler(completionHandler:Function) {
    TSBackgroundFetch.sharedInstance().performFetchWithCompletionHandler(completionHandler);
  }

  public static configure(config:Object, callback:Function, failure?:Function) {
    var fetchManager = TSBackgroundFetch.sharedInstance();
    fetchManager.configure(config);

    if (fetchManager.start()) {
      this.configured = true;
      fetchManager.addListenerCallback(TAG, callback);
    } else {
      console.log(TAG, "failed to start TSBackgroundFetch");
      if (failure) {
        failure();
      }
    }
  }
  public static start(success?:Function, failure?:Function) {
    if (TSBackgroundFetch.sharedInstance().start()) {
      if (success) { success(); }
    } else {
      if (failure) { failure();}
    }
  }

  public static stop(success?:Function, failure?:Function) {
    TSBackgroundFetch.sharedInstance().stop();
    if (success) {
      success();
    }
  }

  public static finish(result?:number) {
    result = result || BackgroundFetch.FETCH_RESULT_NO_DATA;
    switch(result) {
      case 0:
        result = UIBackgroundFetchResultNewData;
        break;
      case 1:
        result = UIBackgroundFetchResultNoData;
        break;
      case 2:
        result = UIBackgroundFetchResultFailed;
        break;
      default:
        result = UIBackgroundFetchResultNoData;
    }
    TSBackgroundFetch.sharedInstance().finishResult(TAG, result);
  }
}