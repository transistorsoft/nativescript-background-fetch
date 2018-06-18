import "./bundle-config";
import * as application from 'application';

import {BackgroundFetch} from "nativescript-background-fetch";

declare var TSBackgroundFetch: any;

if (application.ios) {
  class MyDelegate extends UIResponder {
  	public static ObjCProtocols = [UIApplicationDelegate];

    public applicationPerformFetchWithCompletionHandler(application: UIApplication, completionHandler:any) {
      console.log('- AppDelegate Rx Fetch event');
      BackgroundFetch.performFetchWithCompletionHandler(completionHandler, application.applicationState);
    }
  }
  application.ios.delegate = MyDelegate;
} else if (application.android) {
  BackgroundFetch.registerHeadlessTask(async () => {
    console.log('[BackgroundFetch] Demo Headless Task');
    let result = await doWork();    
    BackgroundFetch.finish();
  });

  let doWork = () => {
    return new Promise((resolve, reject) => {
      // Do some work.
      let result = true;
      if (result) { 
        resolve('OK') 
      } else {
        reject('OOPS!');
      }
    });
  }

}

application.run({ moduleName: 'app-root' });
