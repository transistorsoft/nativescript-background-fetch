var emptyFn = function() {};

export class BackgroundFetch {
  private static configured: boolean;

  public static configure(config?:Object, callback?:Function, failure?:Function) {
    console.warn('BackgroundFetch has no Android implementation');
  }
  public static start(success?:Function, failure?:Function) {}
  public static stop(success?:Function, failure?:Function) {}
  public static finish(result?:number) {} 
  public static status(success:Function) {}
}