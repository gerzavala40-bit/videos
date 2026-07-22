export declare class FileSystemHelper {
    #private;
    writeFile(fileHandle: FileSystemFileHandle, contents: Uint8Array): Promise<void>;
    readFile(file: File): Promise<unknown>;
    getFileHandle(): Promise<any>;
    getNewFileHandle(): any;
    verifyPermission(fileHandle: FileSystemFileHandle, withWrite: boolean): Promise<boolean>;
}
