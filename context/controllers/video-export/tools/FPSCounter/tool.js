export class FPSCounter {
    setter;
    update_every;
    last_frame_time = performance.now();
    accumulated_time = 0;
    constructor(setter, update_every) {
        this.setter = setter;
        this.update_every = update_every;
    }
    update() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.last_frame_time;
        this.last_frame_time = currentTime;
        this.accumulated_time += deltaTime;
        if (this.accumulated_time >= this.update_every) {
            const fps = Math.round(1000 / deltaTime);
            this.setter(fps);
            this.accumulated_time = 0;
        }
    }
}
//# sourceMappingURL=tool.js.map