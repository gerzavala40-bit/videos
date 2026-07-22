import { Canvas2DRenderer } from "./utils/renderer_2d.js";
const decoder = new VideoDecoder({
    output(frame) {
        if (startTime == null) {
            startTime = performance.now();
        }
        else {
            const elapsed = (performance.now() - startTime) / 1000;
            const fps = ++frameCount / elapsed;
            setStatus("render", `${fps.toFixed(0)} fps`);
        }
        renderFrame(frame);
    },
    error(e) {
        setStatus("decode", e);
    }
});
let pendingStatus = null;
const setStatus = (type, message) => {
    if (pendingStatus) {
        pendingStatus[type] = message;
    }
    else {
        pendingStatus = { [type]: message };
        self.requestAnimationFrame(statusAnimationFrame);
    }
};
const statusAnimationFrame = () => {
    self.postMessage(pendingStatus);
    pendingStatus = null;
};
let renderer = null;
let pendingFrame = null;
let startTime = null;
let frameCount = 0;
const renderFrame = (frame) => {
    if (!pendingFrame) {
        requestAnimationFrame(renderAnimationFrame);
    }
    else {
        pendingFrame.close();
    }
    pendingFrame = frame;
};
const renderAnimationFrame = () => {
    renderer?.draw(pendingFrame);
    pendingFrame = null;
};
const start = ({ dataUri, rendererName, canvas }) => {
    switch (rendererName) {
        case "2d":
            renderer = new Canvas2DRenderer(canvas);
            break;
        case "webgl":
            //renderer = new WebGLRenderer(rendererName, canvas);
            break;
        case "webgl2":
            break;
        //renderer = new WebGLRenderer(rendererName, canvas);
        case "webgpu":
            //renderer = new WebGPURenderer(canvas);
            break;
    }
};
self.addEventListener("message", message => start(message.data), { once: true });
//# sourceMappingURL=worker.js.map