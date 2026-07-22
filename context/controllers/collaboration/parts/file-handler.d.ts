import { Connection } from "sparrow-rtc";
import { State } from "../../../types.js";
import { Compressor } from "./compressor.js";
import { Collaboration } from "../controller.js";
import { AnyMedia } from "../../../../components/omni-media/types.js";
import { BinaryAccumulator } from "../../video-export/tools/BinaryAccumulator/tool.js";
export interface FileMetadata {
    hash: string;
    name: string;
    type: string;
    size: number;
    total?: number;
    proxy: boolean;
}
export declare class FileHandler {
    #private;
    private collaboration;
    receivedFiles: {
        hash: string;
        proxy: boolean;
        receivedFrom: Connection;
    }[];
    binary_accumulators: {
        [hash: string]: BinaryAccumulator;
    };
    levels: {
        resolution: string;
        crf: string;
        preset: string;
        suffix: string;
    }[];
    compressor: Compressor;
    constructor(collaboration: Collaboration);
    get filesInProgress(): [string, {
        received: number;
        total: number;
        proxy: boolean;
    }][];
    get filesMetadata(): [string, FileMetadata][];
    sendChunk(compressedChunk: Uint8Array, hash: string, dataChannel: RTCDataChannel): void;
    sendFile(file: File, hash: string, dataChannel: RTCDataChannel, total: number): void;
    requestOriginalVideoFile(requestedFileHash: string): void;
    onFileChunk(connection: Connection, event: MessageEvent<any>, hashLength: number, onComplete: (hash: string, file: File, proxy?: boolean) => void, onProgress?: (hash: string, receivedBytes: number, totalBytes: number) => void): Promise<void>;
    sendFileMetadata(dataChannel: RTCDataChannel, hash: string, file: File, proxy: boolean, total?: number): void;
    getMissingFiles(state: State): Promise<string[]>;
    markFileAsSynced(hash: string): void;
    getSizeInMB(uint8Array: Uint8Array): string;
    handleMissingFiles(missing: string[], connection: Connection): void;
    broadcastMedia(media: AnyMedia, connection?: Connection, proxy?: boolean): void;
}
