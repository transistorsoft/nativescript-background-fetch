import application = require("application");

class MyDelegate extends UIResponder {
	public static ObjCProtocols = [UIApplicationDelegate];

  public applicationPerformFetchWithCompletionHandler(application: UIApplication, completionHandler:any) {
    console.log('- AppDelegate Rx Fetch event');
    var fetchManager = TSBackgroundFetch.sharedInstance();
    fetchManager.performFetchWithCompletionHandler(completionHandler);
  }
}
application.ios.delegate = MyDelegate;

application.start({ moduleName: "main-page" });
