import { HistoricalState } from "./types.js";
export declare class Helpers {
    private timeline;
    constructor(timeline: HistoricalState);
    get_effect(id: string): import("./types.js").AnyEffect | undefined;
    get_effects(): import("./types.js").AnyEffect[];
}
