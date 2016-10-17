import observable = require("data/observable");

import {BackgroundFetch} from "nativescript-background-fetch";

export class HelloWorldModel extends observable.Observable {
  private _counter: number;
  private _message: string;
  private _fetchManager: BackgroundFetch;

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

    BackgroundFetch.configure({}, function() {
      console.log('[js] BackgroundFetch Event Received!');
      this._counter++;
      this.updateMessage();
    	BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
    }.bind(this), function(error) {
    	console.log('[js] Background Fetch FAILED');
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