import { Compositor } from "../controller.js";
type VerticalLineCoords = {
    x: number;
    y1: number;
    y2: number;
};
type HorizontalLineCoords = {
    y: number;
    x1: number;
    x2: number;
};
type IgnoreObjTypes = {
    key: string;
    value: any;
}[];
export declare class AlignGuidelines {
    aligningLineMargin: number;
    aligningLineWidth: number;
    aligningLineColor: string;
    ignoreObjTypes: IgnoreObjTypes;
    pickObjTypes: IgnoreObjTypes;
    app: PIXI.Application<PIXI.Renderer<any>>;
    compositor: Compositor;
    viewportTransform: any;
    verticalLines: VerticalLineCoords[];
    horizontalLines: HorizontalLineCoords[];
    graphics: import("../../../pixi.mjs.js").Graphics;
    constructor({ compositor, app, aligningOptions, ignoreObjTypes, pickObjTypes, }: {
        app: PIXI.Application;
        compositor: Compositor;
        ignoreObjTypes?: IgnoreObjTypes;
        pickObjTypes?: IgnoreObjTypes;
        aligningOptions?: {
            lineMargin?: number;
            lineWidth?: number;
            lineColor?: string;
        };
    });
    private drawSign;
    private drawLine;
    private drawVerticalLine;
    private drawHorizontalLine;
    private isInRange;
    private watchMouseDown;
    private watchMouseUp;
    private watchMouseWheel;
    private clearLinesMeta;
    on_object_move_or_scale(e: PIXI.FederatedPointerEvent): void;
    private watchObjectMoving;
    private getObjDraggingObjCoords;
    private omitCoords;
    private getObjMaxWidthHeightByCoords;
    /**
     * fabric.Object.getCenterPoint will return the center point of the object calc by mouse moving & dragging distance.
     * calcCenterPointByACoords will return real center point of the object position.
     */
    private calcCenterPointByACoords;
    private traversAllObjects;
    private snap;
    clearGuideline(): void;
    watchRender(): void;
    init(): void;
}
export declare const transformPoint: (p: {
    x: number;
    y: number;
}, t: PIXI.Matrix, ignoreOffset?: boolean) => PIXI.Point;
export {};
