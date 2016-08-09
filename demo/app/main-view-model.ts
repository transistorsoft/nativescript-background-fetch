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

        var fetchManager = new BackgroundFetch();
        fetchManager.configure({}, function() {
        	console.log('[js] ************ Background Fetch Rx *************');
        	fetchManager.finish();
        }, function(error) {
        	console.log('[js] ************ Background Fetch FAIL ***********');
        });

        // Initialize default values.
        this._counter = 42;
        this.updateMessage();
    }

    private updateMessage() {
        if (this._counter <= 0) {
            this.message = "Hoorraaay! You unlocked the NativeScript clicker achievement!";
        } else {
            this.message = this._counter + " taps left";
        }
    }

    public onTap() {
        this._counter--;
        this.updateMessage();
    }
}