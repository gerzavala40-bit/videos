import { Connection } from "sparrow-rtc";
import { FileHandler } from "./file-handler";
import type { file as File, dir as Dir, write as Write } from "opfs-tools";
declare const file: typeof File;
declare const dir: typeof Dir;
declare const write: typeof Write;
export { file, dir, write };
interface ChunkMetadata {
    offset: number;
    length: number;
}
export declare class OPFSManager {
    #private;
    private fileHandler;
    constructor(fileHandler: FileHandler);
    createMetadataFile(videoFileName: string): Promise<void>;
    writeChunk(fileHash: string, chunk: Uint8Array): Promise<void>;
    readChunk(fileName: string, metadataFileName: string, chunkIndex: number): Promise<Uint8Array>;
    sendFile(originalFile: File, fileHash: string, frames: number, peer: Connection): void;
    writeMetadata(metadataFileName: string, metadata: ChunkMetadata[]): Promise<void>;
}
