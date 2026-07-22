import { HistoricalState } from "../../types.js";
export type Store = Partial<HistoricalState>;
export declare function store(storage: Storage): {
    [key: string]: any;
} & Partial<HistoricalState>;
