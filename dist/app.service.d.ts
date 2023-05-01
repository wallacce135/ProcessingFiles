export declare class AppService {
    generatePassword(minLength: any, maxLength: any): string;
    cssProcessing(files: Array<string>, output: string): void;
    JsProccessing(files: Array<string>, output: string): void;
    HTMLProcessing(files: Array<string>, output: string): void;
    photoProcessing(photoPathArr: string[], files: string[], output: string): any;
    getDirectories: (source: any, files: any) => any;
}
