import { State } from "../../types.js";
import { Actions } from "../../actions.js";
import { OmniContext } from "../../context.js";
type ShortcutAction = (state: State) => void;
export type ActionType = "Undo" | "Redo" | "Paste" | "Copy" | "Delete" | "Split" | "Cut" | "Next frame" | "Previous frame" | "Play/Pause timeline";
export declare class Shortcuts {
    #private;
    private context;
    private actions;
    constructor(context: OmniContext, actions: Actions);
    getKeyCombination(event: KeyboardEvent): string;
    register(shortcut: string, type: string, actionType: ActionType, action: ShortcutAction): void;
    updateShortcut(type: ActionType, newShortcut: string, override?: boolean): void;
    resetToDefaults(): void;
    handleEvent(event: KeyboardEvent, state: State): void;
    get controllers(): {
        timeline: import("../timeline/controller.js").Timeline;
        compositor: import("../compositor/controller.js").Compositor;
        media: import("../media/controller.js").Media;
        video_export: import("../video-export/controller.js").VideoExport;
        shortcuts: Shortcuts;
        collaboration: import("../collaboration/controller.js").Collaboration;
    };
    listShortcuts(type?: string): {
        shortcut: string;
        actionType: ActionType;
    }[];
}
export declare const DEFAULT_SHORTCUTS: {
    actionType: ActionType;
    type: string;
    shortcut: string;
}[];
export {};
