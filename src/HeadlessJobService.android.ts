import HeadlessTask from "./headless-task";

declare var com: any;
let Fetch = com.transistorsoft.tsbackgroundfetch.BackgroundFetch;
let CompletionHandler = com.transistorsoft.tsbackgroundfetch.FetchJobService.CompletionHandler;

@JavaProxy("com.transistorsoft.backgroundfetch.HeadlessJobService")
class HeadlessJobService extends android.app.job.JobService {
  public onStartJob(params:android.app.job.JobParameters):boolean {
    Fetch.getInstance(this.getApplicationContext()).registerCompletionHandler(new CompletionHandler({
      finish: () => {
        console.log('[HeadlessJobService] finish');
        this.jobFinished(params, false);
      }
    }));
    if (!HeadlessTask.invokeHeadlessTask()) {
      this.jobFinished(params, false);
    }
    return true;
  }

  public onStopJob(params:android.app.job.JobParameters):boolean {
    this.jobFinished(params, false);
    return true;
  }
}


