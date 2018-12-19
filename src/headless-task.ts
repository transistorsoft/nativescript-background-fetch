export default class HeadlessTask {
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
}