BackgroundFetch
==============================

iOS [Background Fetch](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplication_Class/#//apple_ref/occ/instm/UIApplication/setMinimumBackgroundFetchInterval:) Implementation.  

iOS Background Fetch is basically an API which wakes up your app about every 15 minutes (during the user's prime-time hours) and provides your app **exactly 30s** of background running-time.  This plugin will execute your provided `callbackFn` whenever a background-fetch event occurs.  There is **no way** to increase the rate which a fetch-event occurs and this plugin sets the rate to the most frequent possible value of `UIApplicationBackgroundFetchIntervalMinimum` -- iOS determines the rate automatically based upon device usage and time-of-day (ie: fetch-rate is about ~15min during prime-time hours; less frequently when the user is presumed to be sleeping, at 3am for example).

[Tutorial](http://www.doubleencore.com/2013/09/ios-7-background-fetch/)

## Installing the plugin ##

```Bash
   $ tns plugin add nativescript-background-fetch
```

## Setup

BackgroundFetch requires implementation of the **`AppDelegate`** method **`applicationPerformFetchWithCompletionHandler`**.  In your **`app.ts`**, add the following block (If you've already implemented an **`AppDelegate`**, simply add the method `applicationPerformFetchWithCompletionHandler` to your existing implementation).

**`app.ts`**
```diff
import * as app from 'application';

+import {BackgroundFetch} from "nativescript-background-fetch";

+if (app.ios) {
+  class MyDelegate extends UIResponder implements UIApplicationDelegate {
+    public static ObjCProtocols = [UIApplicationDelegate];

+    public applicationPerformFetchWithCompletionHandler(application: UIApplication, completionHandler:any) {
+      BackgroundFetch.performFetchWithCompletionHandler(application, completionHandler);
+    }
+  }
+  app.ios.delegate = MyDelegate;
+}

app.start({ moduleName: 'main-page' });
```

**NOTE** If your build fails with the following errors:
```
app/app.ts(6,28): error TS2304: Cannot find name 'UIResponder'.
app/app.ts(6,51): error TS2304: Cannot find name 'UIApplicationDelegate'.
app/app.ts(7,36): error TS2304: Cannot find name 'UIApplicationDelegate'.
```

This is because your app hasn't loaded the ios platform-declarations.  You can either load those (if you know how ;)) or simply configure your `tsconfig.json` to ignore errors:

```diff
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "sourceMap": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "noEmitHelpers": true,
+        "noEmitOnError": false
    },
    "exclude": [
        "node_modules",
        "platforms"
    ]
}
```

## Config 

#### `@param {Integer} minimumFetchInterval [15]`

The minimum interval in **minutes** to execute background fetch events.  Defaults to **`15`** minutes.  **Note**:  Background-fetch events will **never** occur at a frequency higher than **every 15 minutes**.  Apple uses a secret algorithm to adjust the frequency of fetch events, presumably based upon usage patterns of the app.  Fetch events *can* occur less often than your configured `minimumFetchInterval`.

####`@param {Boolean} stopOnTerminate`

Set `true` to cease background-fetch from operating after user "closes" the app.  Defaults to `true`.

## Methods

| Method Name | Arguments | Notes
|-------------|-----------|---------------------------------------------------|
| `performFetchWithCompletionHandler` | `Function` | This method is **required** to be called in your custom `AppDelegate`, initiated the background-fetch event received from iOS.  See [Setup instructions](#setup) above. |
| `configure` | `callbackFn`, `failureFn`, `{config}` | Configures the plugin's fetch `callbackFn`.  This callback will fire each time an iOS background-fetch event occurs (typically every 15 min).  The `failureFn` will be called if the device doesn't support background-fetch. |
| `finish` | `[UIBackgroundFetchResult]` | You **MUST** call this method in your fetch `callbackFn` provided to `#configure` in order to signal to iOS that your fetch action is complete.  iOS provides **only** 30s of background-time for a fetch-event -- if you exceed this 30s, iOS will kill your app. |
| `start` | `successFn`, `failureFn` | Start the background-fetch API.  Your `callbackFn` provided to `#configure` will be executed each time a background-fetch event occurs.  **NOTE** the `#configure` method *automatically* calls `#start`.  You do **not** have to call this method after you `#configure` the plugin |
| `stop` | `successFn`, `failureFn` | Stop the background-fetch API from firing fetch events.  Your `callbackFn` provided to `#configure` will no longer be executed. |
| `status` | `successFn` | Fetch the `UIBackgroundRefreshStatus` |

## Example ##

A full example could be:
```Javascript

import {BackgroundFetch} from "nativescript-background-fetch";

export class HelloWorldModel
  constructor() {
    super();

    // You can query the UIBackgroundRefreshStatus.  User can disable fetch.
    BackgroundFetch.status((status) => {
      console.log('- BackgroundFetch status: ', status);
    });

    // Configure Background Fetch
    BackgroundFetch.configure({
      stopOnTerminate: false,
      minimumFetchInterval: 30  // minutes
    }, () => {
      console.log("[js] BackgroundFetch event received");
      //
      // Do stuff.  You have 30s of background-time.
      //
      // When your job is complete, you must signal completion or iOS can kill your app.  Signal the nature of the fetch-event, whether you recevied:
      // UIBackgroundFetchResult.NewData: Received new data from your server
      // UIBackgroundFetchResult.NoData:  No new data received from your server
      // UIBackgroundFetchResult.Failed:  Failed to receive new data.
      BackgroundFetch.finish(UIBackgroundFetchResult.NewData);
    }, (status) => {
      console.log('BackgroundFetch not supported by your OS', status);
    });

    // Later, to stop background-fetch events from firing:
    //BackgroundFetch.stop();

    // Or restart them again:
    /*
    BackgroundFetch.start(() => {
      console.log("BackgroundFetch successfully started");
    }, (status) {
      console.log("BackgroundFetch failed to start: ", status);
    });
    */
  }
}
```

## iOS

Implements [performFetchWithCompletionHandler](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplicationDelegate_Protocol/Reference/Reference.html#//apple_ref/occ/intfm/UIApplicationDelegate/application:performFetchWithCompletionHandler:)

## Licence ##

The MIT License

Copyright (c) 2013 Chris Scott, Transistor Software <chris@transistorsoft.com>
http://transistorsoft.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
