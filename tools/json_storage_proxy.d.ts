type JsonStorageProxy<R> = {
    [key: string]: any;
} & R;
export declare function json_storage_proxy<R extends Record<string, any>>(storage: Storage, prefix?: string): JsonStorageProxy<R>;
export {};
