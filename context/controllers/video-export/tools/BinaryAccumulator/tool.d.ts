export declare class BinaryAccumulator {
    #private;
    add_chunk(chunk: Uint8Array): void;
    get binary(): Uint8Array;
    get size(): number;
    clear_binary(): void;
}
