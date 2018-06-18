import {BackgroundFetch} from "./background-fetch";

declare var com: any;

let Fetch = com.transistorsoft.tsbackgroundfetch.BackgroundFetch;

@JavaProxy("com.transistorsoft.backgroundfetch.HeadlessBroadcastReceiver")
class HeadlessBroadcastReceiver extends android.content.BroadcastReceiver {
  public onReceive(context:android.content.Context, intent:android.content.Intent) {
    let adapter = Fetch.getInstance(context);
    if (adapter.isMainActivityActive().booleanValue()) {
      return;
    }
    BackgroundFetch.invokeHeadlessTask();
  }
}