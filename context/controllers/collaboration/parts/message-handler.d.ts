import { Connection } from "sparrow-rtc";
import { Actions } from "../../../actions.js";
import { FileHandler } from "./file-handler.js";
import { Collaboration } from "../controller.js";
export declare class MessageHandler {
    #private;
    private collaboration;
    private fileHandler;
    constructor(collaboration: Collaboration, fileHandler: FileHandler);
    handleMessage(connection: Connection, event: MessageEvent<any>): Promise<void>;
    broadcastAction(actionType: keyof Actions, payload: any, connection?: Connection): void;
}
