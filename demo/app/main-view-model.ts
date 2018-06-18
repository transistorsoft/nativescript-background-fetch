import observable = require("data/observable");
import Platform = require('platform');
import {BackgroundFetch} from "nativescript-background-fetch";

export class HelloWorldModel extends observable.Observable {
  private _counter: number;
  private _message: string;
  private _fetchManager: BackgroundFetch;
  private _platform: any;

  get platform():any {
    return Platform;
  }

  get message(): string {
    return this._message;
  }
  set message(value: string) {
    if (this._message !== value) {
      this._message = value;
      this.notifyPropertyChange("message", value)
    }
  }

  constructor() {
    super();

    BackgroundFetch.configure({
      minimumFetchInterval: 15,
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true
    }, function() {
      console.log('[BackgroundFetch] Event Received!');
      this._counter++;
      this.updateMessage();
    	BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
    }.bind(this), function(error) {
    	console.log('[BackgroundFetch] FAILED');
    }.bind(this));

    // Initialize default values.
    this._counter = 0;
    this.updateMessage();
  }

  private updateMessage() {
    this.message = this._counter + " BackgroundFetch events received";
  }

  public onTap() {
    this._counter--;
    this.updateMessage();
  }
}

/*
if (application.android) {
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
*/