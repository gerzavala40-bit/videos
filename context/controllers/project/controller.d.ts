import { HistoricalState } from "../../types.js";
export declare class Project {
    #private;
    onNotify: import("@benev/slate").Pub<{
        message: string;
        type: "error" | "warning" | "info";
    }>;
    constructor();
    getMimeType(filename: string): string;
    getFileExtension(file: File): string;
    importProject(input: HTMLInputElement): Promise<HistoricalState | null>;
    exportProject(state: HistoricalState): Promise<void>;
    loadProjectsFromStorage(): Generator<HistoricalState | undefined, void, unknown>;
}
