var emptyFn = function() {};

export class BackgroundFetch {
  public static FETCH_RESULT_NEW_DATA = 0;
  public static FETCH_RESULT_NO_DATA = 1;
  public static FETCH_RESULT_FAILED = 2;

  private static configured: boolean;

  public static configure(config?:Object, callback?:Function, failure?:Function) {
    console.warn('BackgroundFetch#configure has no Android implementation');
  }
  public static start(success?:Function, failure?:Function) {
    console.warn('BackgroundFetch#start has no Android implementation');
  }

  public static stop(success?:Function, failure?:Function) {
    console.warn('BackgroundFetch#stop has no Android implementation');
  }

  public static finish(result?:number) {
    console.warn('BackgroundFetch#finish has no Android implementation');
  }
}