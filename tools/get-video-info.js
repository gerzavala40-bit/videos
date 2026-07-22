import MP4Box from './mp4boxjs/mp4box.adapter.js';
export function getVideoInfo(file) {
    return new Promise((resolve) => {
        const mp4file = MP4Box.createFile();
        mp4file.onReady = (info) => {
            const track = info.videoTracks[0];
            resolve(track);
        };
        const fileSink = new MP4FileSink(mp4file);
        //@ts-ignore
        file.stream().pipeTo(new WritableStream(fileSink, { highWaterMark: 1 }));
    });
}
export class MP4FileSink {
    #file;
    #offset = 0;
    constructor(file) {
        this.#file = file;
    }
    write(chunk) {
        const buffer = new ArrayBuffer(chunk.byteLength);
        //@ts-ignore
        new Uint8Array(buffer).set(chunk);
        //@ts-ignore
        buffer.fileStart = this.#offset;
        this.#offset += buffer.byteLength;
        //@ts-ignore
        this.#file.appendBuffer(buffer);
    }
    close() {
        this.#file.flush();
    }
}
//# sourceMappingURL=get-video-info.js.map