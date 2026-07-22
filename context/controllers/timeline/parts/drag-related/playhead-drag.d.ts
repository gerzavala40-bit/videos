export declare class PlayheadDrag {
    #private;
    grabbed: boolean;
    onPlayheadMoveThrottled: import("@benev/slate").Pub<{
        x: number;
    }>;
    onPlayheadMove: import("@benev/slate").Pub<{
        x: number;
    }>;
    move(x: number): void;
    start(): void;
    drop(): void;
    end(): void;
}
