nativescript-background-fetch &middot; [![npm](https://img.shields.io/npm/dm/nativescript-background-fetch.svg)]() [![npm](https://img.shields.io/npm/v/nativescript-background-fetch.svg)]()
==============================================================================

[![](https://dl.dropboxusercontent.com/s/nm4s5ltlug63vv8/logo-150-print.png?dl=1)](https://www.transistorsoft.com)

By [**Transistor Software**](http://transistorsoft.com), creators of [**NativeScript Background Geolocation**](http://www.transistorsoft.com/shop/products/nativescript-background-geolocation-lt)

------------------------------------------------------------------------------

Background Fetch is a *very* simple plugin which will awaken an app in the background about **every 15 minutes**, providing a short period of background running-time.  This plugin will execute your provided `callbackFn` whenever a background-fetch event occurs.

There is **no way** to increase the rate which a fetch-event occurs and this plugin sets the rate to the most frequent possible &mdash; you will **never** receive an event faster than **15 minutes**.  The operating-system will automatically throttle the rate the background-fetch events occur based upon usage patterns.  Eg: if user hasn't turned on their phone for a long period of time, fetch events will occur less frequently.

The Android plugin provides a "Headless" implementation allowing you to continue handling events with Javascript even after app-termination (see **[`@config enableHeadless`](#config-boolean-enableheadless-false)**)

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
+      BackgroundFetch.performFetchWithCompletionHandler(completionHandler, application.applicationState);
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

Add the following items to `references.d.ts` in the root of your project (create it if it doesn't exist):

:open_file_folder: **`/references.d.ts`**
```typescript
/// <reference path="./node_modules/tns-platform-declarations/ios.d.ts" />
/// <reference path="./node_modules/tns-platform-declarations/android.d.ts" />
```

## Config 

### Common Options

#### `@param {Integer} minimumFetchInterval [15]`

The minimum interval in **minutes** to execute background fetch events.  Defaults to **`15`** minutes.  **Note**:  Background-fetch events will **never** occur at a frequency higher than **every 15 minutes**.  Apple uses a secret algorithm to adjust the frequency of fetch events, presumably based upon usage patterns of the app.  Fetch events *can* occur less often than your configured `minimumFetchInterval`.


### Android Options

#### `@config {Boolean} stopOnTerminate [true]`

Set `false` to continue background-fetch events after user terminates the app.  Default to `true`.

#### `@config {Boolean} startOnBoot [false]`

Set `true` to initiate background-fetch events when the device is rebooted.  Defaults to `false`.

:exclamation: **NOTE:** `startOnBoot` requires `stopOnTerminate: false`.

#### `@config {Boolean} forceReload [false]`

Set `true` to automatically relaunch the application (if it was terminated) &mdash; the application will launch to the foreground then immediately minimize.  Defaults to `false`.

#### `@config {Boolean} enableHeadless [false]`

Set `true` to enable the Android "Headless Javascript" mechanism, for handling fetch events **after app termination** with a Javascript callback.

* :open_file_folder: **`app.ts`**
```typescript
import * as application from 'application';

import {BackgroundFetch} from "nativescript-background-fetch";

if (application.android) {
  // This headless task will execute only when Android app is terminated.
  BackgroundFetch.registerHeadlessTask(async () => {
    console.log('[My BackgroundFetch HeadlessTask] onFetch');    
    // Do some asynchronous work (eg: HTTP Request)
    let result = await doWork();
    // Politely signal to the OS that our processing is complete.
    BackgroundFetch.finish();
  });

  // Your example task.
  let doWork = () => {
    return new Promise((resolve, reject) => {
      // Do some work.
      let result = true;  // <-- example result from HTTP request.
      if (true) { 
        resolve('OK') 
      } else {
        reject('OOPS!');
      }
    });
  }
}

application.run({ moduleName: 'app-root' });
```

## Methods

| Method Name | Arguments | Notes
|-------------|-----------|---------------------------------------------------|
| `performFetchWithCompletionHandler` | `Function` | This method is **required** to be called in your custom `AppDelegate`, initiated the background-fetch event received from iOS.  See [Setup instructions](#setup) above. |
| `configure` | `{config}`, `callbackFn`, `failureFn` | Configures the plugin's fetch `callbackFn`.  This callback will fire each time an iOS background-fetch event occurs (typically every 15 min).  The `failureFn` will be called if the device doesn't support background-fetch. |
| `status` | `callbackFn` | Your callback will be executed with the current `status (Integer)` `0: Restricted`, `1: Denied`, `2: Available`.  These constants are defined as `BackgroundFetch.STATUS_RESTRICTED`, `BackgroundFetch.STATUS_DENIED`, `BackgroundFetch.STATUS_AVAILABLE` (**NOTE:** Android will always return `STATUS_AVAILABLE`)|
| `finish` | `fetchResult` | Valid values for `fetchResult (Integer)` include `BackgroundFetch.FETCH_RESULT_NEW_DATA` (0), `BackgroundFetch.FETCH_RESULT_NO_DATA` (1), and `BackgroundFetch.FETCH_RESULT_FAILED` (2).  You **MUST** call this method in your fetch `callbackFn` provided to `#configure` in order to signal to iOS that your fetch action is complete.  iOS provides **only** 30s of background-time for a fetch-event -- if you exceed this 30s, iOS will kill your app. |
| `start` | `successFn`, `failureFn` | Start the background-fetch API.  Your `callbackFn` provided to `#configure` will be executed each time a background-fetch event occurs.  **NOTE** the `#configure` method *automatically* calls `#start`.  You do **not** have to call this method after you `#configure` the plugin |
| `stop` | `successFn`, `failureFn` | Stop the background-fetch API from firing fetch events.  Your `callbackFn` provided to `#configure` will no longer be executed. |
| `registerHeadlessTask` | `callback` | Registers an Android "Headless Task" to receive Android background-fetch events when your application is terminated.   (:warning: requires [`stopOnTerminate: false`](#config-boolean-stoponterminate-true) and [`enableHeadless: true`](#config-boolean-enableheadless-false)) |


## Example ##

A full example could be:
```javascript

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
      minimumFetchInterval: 30,  // minutes
      stopOnTerminate: false,    // Android-only
      startOnBoot: true          // Android-only
    }, () => {
      console.log("[js] BackgroundFetch event received");
      //
      // Do stuff.  You have 30s of background-time.
      //
      // When your job is complete, you must signal completion or iOS can kill your app.  Signal the nature of the fetch-event, whether you recevied:
      // FETCH_RESULT_NEW_DATA: Received new data from your server
      // FETCH_RESULT_NO_DATA:  No new data received from your server
      // FETCH_RESULT_FAILED:  Failed to receive new data.
      BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
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

## Debugging

### iOS

- Simulate background fetch events in XCode using **`Debug->Simulate Background Fetch`**
- iOS can take some hours or even days to start a consistently scheduling background-fetch events since iOS schedules fetch events based upon the user's patterns of activity.  If *Simulate Background Fetch* works, your can be **sure** that everything is working fine.  You just need to wait.

### Android

- Observe plugin logs in `$ adb logcat`:
```bash
$ adb logcat *:S JS:V TSBackgroundFetch:V
```
- Simulate a background-fetch event on a device (insert *&lt;your.application.id&gt;*) (only works for sdk `21+`:
```bash
$ adb shell cmd jobscheduler run -f <your.application.id> 999
```
- For devices with sdk `<21`, simulate a "Headless JS" event with (insert *&lt;your.application.id&gt;*)
```bash
$ adb shell am broadcast -a <your.application.id>.event.BACKGROUND_FETCH

```

## Implementation

### iOS

Implements [performFetchWithCompletionHandler](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplicationDelegate_Protocol/Reference/Reference.html#//apple_ref/occ/intfm/UIApplicationDelegate/application:performFetchWithCompletionHandler:), firing a custom event subscribed-to in cordova plugin.

### Android

Android implements background fetch using two different mechanisms, depending on the Android SDK version.  Where the SDK version is `>= LOLLIPOP`, the new [`JobScheduler`](https://developer.android.com/reference/android/app/job/JobScheduler.html) API is used.  Otherwise, the old [`AlarmManager`](https://developer.android.com/reference/android/app/AlarmManager.html) will be used.

Unlike iOS, the Android implementation *can* continue to operate after application terminate (`stopOnTerminate: false`) or device reboot (`startOnBoot: true`).



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
