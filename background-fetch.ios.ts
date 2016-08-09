declare var TSBackgroundFetch: any;
declare var UIBackgroundFetchResultNewData;

let TAG = "NSBackgroundFetch";

export class BackgroundFetch {
	private fetchManager: any;
  private configured: boolean;

  constructor() {
    
  }
  configure(config, callback:any, failure:any) {
  	var fetchManager = TSBackgroundFetch.sharedInstance();
    fetchManager.configure(config);
    
    if (fetchManager.start()) {
        this.configured = true;
        fetchManager.addListenerCallback(TAG, callback);
    } else {
        console.log(TAG, "failed to start TSBackgroundFetch");
        failure();
    }
  }
  finish(result) {
    var fetchManager = TSBackgroundFetch.sharedInstance();
    fetchManager.finishResult(TAG, UIBackgroundFetchResultNewData);
  }
}