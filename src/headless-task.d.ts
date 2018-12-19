export default class HeadlessTask {
    private static headlessTask;
    static registerHeadlessTask(callback: Function): void;
    static invokeHeadlessTask(): boolean;
}
