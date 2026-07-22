export declare class FPSCounter {
    private setter;
    private update_every;
    last_frame_time: number;
    accumulated_time: number;
    constructor(setter: (fps: number) => void, update_every: number);
    update(): void;
}
