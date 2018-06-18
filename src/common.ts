export class AbstractBackgroundFetch {
  public static STATUS_RESTRICTED:number = 0;
  public static STATUS_DENIED:number     = 1;
  public static STATUS_AVAILABLE:number  = 2;

  public static FETCH_RESULT_NEW_DATA:number = 0;
  public static FETCH_RESULT_NO_DATA:number  = 1;
  public static FETCH_RESULT_FAILED:number   = 2;
}