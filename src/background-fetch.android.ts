// importing this solves issues with __awaiter not defined using await in Android HeadlessTask
import 'nativescript-tslib';

import {AbstractBackgroundFetch} from "./common";

var emptyFn = function() {};

import app = require('application');

declare var com: any;

let Fetch = com.transistorsoft.tsbackgroundfetch.BackgroundFetch;
let FetchConfig = com.transistorsoft.tsbackgroundfetch.BackgroundFetchConfig

export class BackgroundFetch extends AbstractBackgroundFetch {
  private static configured: boolean;
  private static isForceReload:boolean = false;
  private static intent:android.content.Intent;

  private static headlessTask: Function;

  public static registerHeadlessTask(callback:Function) {    
    this.headlessTask = callback;
  }

  public static invokeHeadlessTask():boolean {    
    if (!this.headlessTask) {
      console.log('[BackgroundFetch] invokeHeadlessTask ERROR - headlessTask is null.  Did you BackgroundFetch.registerHeadlessTask(myTask) in your app.ts?');
      return false;
    }
    this.headlessTask();
    return true;
  }

  public static configure(params:any, success:Function, failure?:Function) {
    let builder = new FetchConfig.Builder();
    if (typeof(params.minimumFetchInterval) === 'number') {
      builder.setMinimumFetchInterval(params.minimumFetchInterval);
    }
    if (typeof(params.stopOnTerminate) === 'boolean') {
      builder.setStopOnTerminate(params.stopOnTerminate);
    }
    if (typeof(params.forceReload) === 'boolean') {
      builder.setForceReload(params.forceReload);
    }
    if (typeof(params.startOnBoot) === 'boolean') {
      builder.setStartOnBoot(params.startOnBoot);
    }
    if (params.enableHeadless === true) {
      builder.setJobService('com.transistorsoft.backgroundfetch.HeadlessJobService');
    }
    let adapter = this.getAdapter();
    let callback = new Fetch.Callback({
      onFetch: success
    });
    adapter.configure(builder.build(), callback);

    if (this.isForceReload) {
      callback.onFetch();
    }
  }
  public static start(success?:Function, failure?:Function) {
    success = success || emptyFn;
    let adapter = this.getAdapter();
    adapter.start();
    success();
  }
  public static stop(success?:Function, failure?:Function) {
    success = success || emptyFn;
    let adapter = this.getAdapter();
    adapter.stop();
    success(); 
  }
  public static finish(result?:number) {
    let adapter = this.getAdapter();
    adapter.finish();
  } 
  public static status(success:Function) {}

  private static init() {
    if (!app.android.startActivity || (this.intent !== null)) { 
      return; 
    }
    this.intent = app.android.startActivity.getIntent();
    let action = this.intent.getAction();
    if ((action != null) && (Fetch.ACTION_FORCE_RELOAD.toUpperCase() === action)) {
        this.isForceReload = true;
        app.android.startActivity.moveTaskToBack(true);
    }
  }

  private static getAdapter() {
    if (!this.intent) {
      this.init();
    }
    return Fetch.getInstance(app.android.context.getApplicationContext());
  }
}