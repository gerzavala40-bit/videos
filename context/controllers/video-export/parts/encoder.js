import { FFmpegHelper } from "../helpers/FFmpegHelper/helper.js";
export class Encoder {
    actions;
    compositor;
    media;
    encode_worker = new Worker(new URL("./encode_worker.js", import.meta.url), { type: "module" });
    #ffmpeg;
    file = null;
    constructor(actions, compositor, media) {
        this.actions = actions;
        this.compositor = compositor;
        this.media = media;
        this.#ffmpeg = new FFmpegHelper(actions);
    }
    reset() {
        this.encode_worker.terminate();
        this.encode_worker = new Worker(new URL("./encode_worker.js", import.meta.url), { type: "module" });
        this.file = null;
    }
    export_process_end(effects, timebase) {
        this.actions.set_export_status("flushing");
        this.encode_worker.postMessage({ action: "get-binary" });
        this.encode_worker.onmessage = async (msg) => {
            if (msg.data.action === "binary") {
                const output_name = "output.mp4";
                await this.#ffmpeg.write_composed_data(msg.data.binary, "composed.h264");
                await this.#ffmpeg.merge_audio_with_video_and_mux(effects, "composed.h264", output_name, this.media, timebase);
                const muxed_file = await this.#ffmpeg.get_muxed_file(output_name);
                this.file = muxed_file;
                this.actions.set_export_status("complete");
            }
        };
        return;
    }
    encode_composed_frame(canvas, timestamp) {
        const frame = new VideoFrame(canvas, this.#frame_config(canvas, timestamp));
        this.encode_worker.postMessage({ frame, action: "encode" });
        frame.close();
    }
    #frame_config(canvas, timestamp) {
        return {
            displayWidth: canvas.width,
            displayHeight: canvas.height,
            duration: 1000 / this.compositor.timebase,
            timestamp: timestamp * 1000
        };
    }
    configure([width, height], bitrate, timebase) {
        this.encode_worker.postMessage({ action: "configure", width, height, bitrate, timebase, bitrateMode: "constant" });
    }
}
//# sourceMappingURL=encoder.js.map