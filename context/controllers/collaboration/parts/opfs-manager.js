//@ts-ignore
import * as opfs from 'https://cdn.jsdelivr.net/npm/opfs-tools@0.7.0/+esm';
const file = opfs.file;
const dir = opfs.dir;
const write = opfs.write;
export { file, dir, write };
export class OPFSManager {
    fileHandler;
    #worker = new Worker(new URL('./opfs-worker.js', import.meta.url), { type: "module" });
    constructor(fileHandler) {
        this.fileHandler = fileHandler;
        this.#init();
    }
    async #init() {
        // clear
        await dir('/compressed').remove();
        await dir('/compressed').create();
    }
    async createMetadataFile(videoFileName) {
        const metadataFileName = `${videoFileName}.metadata.json`;
        await write(`/${metadataFileName}`, '[]');
    }
    async writeChunk(fileHash, chunk) {
        this.#worker.postMessage({
            filePath: `/compressed/${fileHash}`,
            metadataPath: `/compressed/${fileHash}.metadata.json`,
            chunk,
            action: 'writeChunk'
        });
    }
    async readChunk(fileName, metadataFileName, chunkIndex) {
        const metadata = await this.#readMetadata(metadataFileName);
        const { offset, length } = metadata[chunkIndex];
        const fileHandle = file(`/${fileName}`);
        const reader = await fileHandle.createReader();
        const arrayBuffer = await reader.read(length, { at: offset });
        await reader.close();
        return new Uint8Array(arrayBuffer);
    }
    async #readMetadata(metadataFileName) {
        const metadataFile = file(`/${metadataFileName}`);
        const metadataText = await metadataFile.text();
        return JSON.parse(metadataText);
    }
    sendFile(originalFile, fileHash, frames, peer) {
        this.fileHandler.sendFileMetadata(peer.cable.reliable, fileHash, originalFile, true, frames);
        this.#worker.postMessage({
            filePath: `/compressed/${fileHash}`,
            metadataPath: `/compressed/${fileHash}.metadata.json`,
            action: 'getFile',
            frames,
            hash: fileHash
        });
        this.#worker.addEventListener("message", (e) => {
            if (e.data.action === "fileChunk") {
                const chunk = e.data.chunk;
                if (e.data.hash === fileHash)
                    this.fileHandler.sendChunk(chunk, e.data.hash, peer.cable.reliable);
            }
            if (e.data.action === "finished") {
                if (e.data.hash === fileHash) {
                    peer.cable.reliable.send(JSON.stringify({ done: true, hash: fileHash, filename: originalFile.name, fileType: originalFile.type, proxy: true }));
                    this.fileHandler.markFileAsSynced(fileHash);
                }
            }
        });
    }
    async writeMetadata(metadataFileName, metadata) {
        const metadataFile = file(`/${metadataFileName}`);
        await write(metadataFile.path, JSON.stringify(metadata));
    }
}
//# sourceMappingURL=opfs-manager.js.map