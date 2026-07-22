import { Connection, SparrowHost, SparrowJoin } from "sparrow-rtc";
import { Actions } from "../../actions.js";
import { Compressor } from "./parts/compressor.js";
import { OPFSManager } from "./parts/opfs-manager.js";
import { AnyMedia } from "../../../components/omni-media/types.js";
export declare class Collaboration {
    #private;
    host: SparrowHost | null;
    client: SparrowJoin | null;
    connectedClients: Map<string, Connection>;
    onNumberOfClientsChange: import("@benev/slate").Pub<number>;
    numberOfConnectedUsers: number;
    onFileProgress: import("@benev/slate").Pub<{
        hash: string;
        progress: number;
    }>;
    onDisconnect: import("@benev/slate").Pub<unknown>;
    onLock: import("@benev/slate").Pub<boolean>;
    onChange: import("@benev/slate").Pub<unknown>;
    compressor: Compressor;
    opfs: OPFSManager;
    isJoining: boolean;
    initiatingProject: boolean;
    constructor();
    createRoom(): Promise<SparrowHost>;
    joinRoom(inviteId: string): Promise<SparrowJoin<import("sparrow-rtc").StdCable>>;
    broadcastAction(actionType: keyof Actions, payload: any): void;
    broadcastMedia(media: AnyMedia): void;
    disconnect(): void;
    cleanup(): void;
    kick(peerID: string): void;
    ban(peerID: string): void;
    toggleLock(): void;
    requestOriginalVideoFile(requestedFileHash: string): void;
    get filesInProgress(): [string, {
        received: number;
        total: number;
        proxy: boolean;
    }][];
    get filesMetada(): [string, import("./parts/file-handler.js").FileMetadata][];
}
