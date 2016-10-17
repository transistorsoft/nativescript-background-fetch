import application = require("application");
import {BackgroundFetch} from "nativescript-background-fetch";

declare var TSBackgroundFetch: any;

class MyDelegate extends UIResponder {
	public static ObjCProtocols = [UIApplicationDelegate];

  public applicationPerformFetchWithCompletionHandler(application: UIApplication, completionHandler:any) {
    console.log('- AppDelegate Rx Fetch event');
    BackgroundFetch.performFetchWithCompletionHandler(completionHandler);
  }
}
application.ios.delegate = MyDelegate;

application.start({ moduleName: "main-page" });
