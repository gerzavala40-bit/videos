import { State } from "../../../types.js";
import { Collaboration } from "../controller.js";
interface CompressProps {
    quality?: number;
    start?: number;
    end?: number;
    onChunk?: (uint: Uint8Array) => void;
}
export declare class Compressor {
    #private;
    private collaboration;
    constructor(collaboration: Collaboration);
    compressVideo(file: File, props?: CompressProps): void;
    compressAllVideos(state: State): Promise<void>;
}
export {};
