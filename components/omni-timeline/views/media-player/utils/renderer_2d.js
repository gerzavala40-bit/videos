export class Canvas2DRenderer {
    #canvas;
    #ctx;
    constructor(canvas) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");
    }
    draw(frame) {
        this.#canvas.width = frame.displayWidth;
        this.#canvas.height = frame.displayHeight;
        this.#ctx.drawImage(frame, 0, 0, frame.displayWidth, frame.displayHeight);
        frame.close();
    }
}
//# sourceMappingURL=renderer_2d.js.map