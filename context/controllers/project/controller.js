import { pub } from "@benev/slate";
import { store } from "../store/store.js";
import { Media } from "../media/controller.js";
import { ZipReader, BlobReader, TextWriter, BlobWriter, ZipWriter, TextReader } from "@zip.js/zip.js/index.js";
// controller with project export/import related stuff
export class Project {
    #media = new Media();
    #store = store(localStorage);
    onNotify = pub();
    constructor() { }
    getMimeType(filename) {
        const mimeTypes = new Map([
            ["jpg", "image/jpeg"],
            ["jpeg", "image/jpeg"],
            ["png", "image/png"],
            ["gif", "image/gif"],
            ["webp", "image/webp"],
            ["mp4", "video/mp4"],
            ["mp3", "audio/mpeg"],
            ["wav", "audio/wav"],
            ["ogg", "audio/ogg"],
            ["webm", "video/webm"],
            ["avi", "video/x-msvideo"],
            ["mov", "video/quicktime"],
            ["zip", "application/zip"],
            ["json", "application/json"],
        ]);
        const extension = filename.split(".").pop()?.toLowerCase();
        if (!extension) {
            this.onNotify.publish({
                message: `No extension found in filename: ${filename}`,
                type: "warning",
            });
            return "application/octet-stream";
        }
        return mimeTypes.get(extension) || "application/octet-stream";
    }
    getFileExtension(file) {
        const mimeToExtension = new Map([
            ["image/jpeg", "jpg"],
            ["image/png", "png"],
            ["image/gif", "gif"],
            ["image/webp", "webp"],
            ["video/mp4", "mp4"],
            ["video/webm", "webm"],
            ["audio/mpeg", "mp3"],
            ["audio/wav", "wav"],
            ["audio/ogg", "ogg"],
        ]);
        const extension = mimeToExtension.get(file.type);
        if (!extension) {
            this.onNotify.publish({
                message: `Unknown MIME type: ${file.type}`,
                type: "warning",
            });
            return "bin";
        }
        return extension;
    }
    async importProject(input) {
        const importedFile = input.files?.[0];
        if (!importedFile) {
            this.onNotify.publish({
                message: "No file selected.",
                type: "warning"
            });
            return null;
        }
        if (importedFile.type !== "application/zip" && !importedFile.name.endsWith(".zip")) {
            this.onNotify.publish({
                message: "Invalid file type. Please select a ZIP file.",
                type: "error"
            });
            return null;
        }
        try {
            const zipReader = new ZipReader(new BlobReader(importedFile));
            const entries = await zipReader.getEntries();
            if (entries.length === 0) {
                this.onNotify.publish({
                    message: "The ZIP file is empty.",
                    type: "error"
                });
                await zipReader.close();
                return null;
            }
            let projectState = null;
            for (const entry of entries) {
                if (entry.directory || !entry.getData) {
                    continue;
                }
                if (entry.filename === "project.json") {
                    const jsonContent = await entry.getData(new TextWriter());
                    projectState = JSON.parse(jsonContent);
                }
                else {
                    const mimeType = this.getMimeType(entry.filename);
                    if (mimeType.startsWith("image") || mimeType.startsWith("audio") || mimeType.startsWith("video")) {
                        const fileBlob = await entry.getData(new BlobWriter());
                        const file = new File([fileBlob], entry.filename, { type: mimeType });
                        await this.#media.import_file(file);
                    }
                }
            }
            await zipReader.close();
            if (!projectState) {
                this.onNotify.publish({
                    message: "No project.json file found in the ZIP.",
                    type: "error"
                });
                return null;
            }
            this.onNotify.publish({
                message: "Project imported successfully!",
                type: "info"
            });
            this.#saveImportedProjectStateToLocalStorage(projectState);
            return projectState;
        }
        catch (error) {
            this.onNotify.publish({
                message: "Failed to import the project. Please try again.",
                type: "error"
            });
            console.error("Error uncompressing ZIP file:", error);
            return null;
        }
    }
    #saveImportedProjectStateToLocalStorage(state) {
        if (state.projectId) {
            this.#store[state.projectId] = {
                projectName: state.projectName,
                projectId: state.projectId,
                effects: state.effects,
                tracks: state.tracks
            };
        }
    }
    async exportProject(state) {
        const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
        const addedFiles = new Set();
        try {
            const projectJson = JSON.stringify(state, null, 2);
            await zipWriter.add("project.json", new TextReader(projectJson));
            for (const effect of state.effects) {
                if ("file_hash" in effect) {
                    if (addedFiles.has(effect.file_hash)) {
                        continue;
                    }
                    const file = await this.#media.get_file(effect.file_hash);
                    if (file) {
                        const extension = this.getFileExtension(file);
                        const filename = `${effect.file_hash}.${extension}`;
                        await zipWriter.add(filename, new BlobReader(file));
                        addedFiles.add(effect.file_hash);
                    }
                    else {
                        this.onNotify.publish({
                            message: `File not found for hash: ${effect.file_hash}`,
                            type: "warning"
                        });
                    }
                }
            }
            // Close and download
            const zipBlob = await zipWriter.close();
            const url = URL.createObjectURL(zipBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${state.projectName || "project"}.zip`;
            link.click();
            URL.revokeObjectURL(url);
            this.onNotify.publish({
                message: "Project exported successfully!",
                type: "info"
            });
        }
        catch (error) {
            this.onNotify.publish({
                message: "Failed to export the project. Please try again.",
                type: "error"
            });
            console.error("Error during export:", error);
        }
    }
    *loadProjectsFromStorage() {
        const prefix = 'omniclip_';
        for (const key in localStorage) {
            if (key && key.startsWith(prefix)) {
                const storedData = localStorage.getItem(key);
                if (storedData) {
                    try {
                        const projectKey = key.replace(prefix, '');
                        const project = storedData ? JSON.parse(storedData) : undefined;
                        const oldStorage = projectKey === "effects" || projectKey === "tracks";
                        if (project && !oldStorage) {
                            yield project;
                        }
                    }
                    catch (error) {
                        yield undefined;
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=controller.js.map