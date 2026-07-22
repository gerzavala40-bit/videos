import { Keys } from "./util.js";
export class AlignGuidelines {
    aligningLineMargin = 30;
    aligningLineWidth = 6;
    aligningLineColor = "#F68066";
    ignoreObjTypes = [];
    pickObjTypes = [];
    app;
    compositor;
    viewportTransform;
    verticalLines = [];
    horizontalLines = [];
    graphics = new PIXI.Graphics(); // graphics for align guidelines
    constructor({ compositor, app, aligningOptions, ignoreObjTypes, pickObjTypes, }) {
        this.compositor = compositor;
        this.app = app;
        this.ignoreObjTypes = ignoreObjTypes || [];
        this.pickObjTypes = pickObjTypes || [];
        this.app.stage.addChild(this.graphics);
        if (aligningOptions) {
            this.aligningLineMargin = aligningOptions.lineMargin || this.aligningLineMargin;
            this.aligningLineWidth = aligningOptions.lineWidth || this.aligningLineWidth;
            this.aligningLineColor = aligningOptions.lineColor || this.aligningLineColor;
        }
    }
    drawSign(x, y) {
        // Draw a small "X" at the given point using setStrokeStyle.
        this.graphics.lineStyle(this.aligningLineWidth, parseInt(this.aligningLineColor.replace("#", "0x")), 1);
        const size = 2;
        this.graphics.moveTo(x - size, y - size);
        this.graphics.lineTo(x + size, y + size);
        this.graphics.moveTo(x + size, y - size);
        this.graphics.lineTo(x - size, y + size);
    }
    drawLine(x1, y1, x2, y2) {
        const point1 = transformPoint(new PIXI.Point(x1, y1), new PIXI.Matrix());
        const point2 = transformPoint(new PIXI.Point(x2, y2), new PIXI.Matrix());
        const strokeColor = parseInt(this.aligningLineColor.replace("#", "0x"));
        this.graphics.lineStyle(this.aligningLineWidth, this.aligningLineColor, 1);
        this.graphics.moveTo(point1.x, point1.y);
        this.graphics.lineTo(point2.x, point2.y);
        // this.compositor.graphics.stroke({width: this.aligningLineWidth, color: this.aligningLineColor})
        this.graphics.zIndex = 500;
        this.app.stage.sortChildren();
        this.drawSign(point1.x, point1.y);
        this.drawSign(point2.x, point2.y);
    }
    drawVerticalLine(coords) {
        const activeObject = this.compositor.selectedElement;
        if (!activeObject) {
            return;
        }
        const movingCoords = this.getObjDraggingObjCoords(activeObject.sprite);
        if (!Keys(movingCoords).some((key) => Math.abs(movingCoords[key].x - coords.x) < 0.0001))
            return;
        this.drawLine(coords.x, Math.min(coords.y1, coords.y2), coords.x, Math.max(coords.y1, coords.y2));
    }
    drawHorizontalLine(coords) {
        const activeObject = this.compositor.selectedElement;
        if (!activeObject) {
            return;
        }
        const movingCoords = this.getObjDraggingObjCoords(activeObject.sprite);
        if (!Keys(movingCoords).some((key) => Math.abs(movingCoords[key].y - coords.y) < 0.0001))
            return;
        this.drawLine(Math.min(coords.x1, coords.x2), coords.y, Math.max(coords.x1, coords.x2), coords.y);
    }
    isInRange(value1, value2) {
        // Assume that the stage scale represents the current zoom (uniform scale)
        const zoom = this.app.stage.scale.x || 1;
        return Math.abs(Math.round(value1) - Math.round(value2)) <= this.aligningLineMargin / zoom;
    }
    watchMouseDown() {
        this.app.stage.on("pointerdown", () => {
            this.clearLinesMeta();
            this.viewportTransform = this.app.stage.worldTransform;
        });
    }
    watchMouseUp() {
        this.app.stage.on("pointerup", () => {
            this.clearLinesMeta();
            this.clearGuideline();
            this.app.renderer.render(this.app.stage);
        });
    }
    watchMouseWheel() {
        this.app.stage.addEventListener("wheel", () => {
            this.clearLinesMeta();
        });
    }
    clearLinesMeta() {
        this.verticalLines.length = this.horizontalLines.length = 0;
    }
    on_object_move_or_scale(e) {
        this.clearLinesMeta();
        this.clearGuideline();
        const activeObject = this.compositor.selectedElement?.sprite;
        if (!activeObject) {
            return;
        }
        const canvasObjects = this.compositor.app.stage.children.filter(obj => {
            if (this.ignoreObjTypes.length) {
                return !this.ignoreObjTypes.some(item => obj[item.key] === item.value);
            }
            if (this.pickObjTypes.length) {
                return this.pickObjTypes.some(item => obj[item.key] === item.value);
            }
            return true;
        });
        const transform = activeObject.worldTransform;
        if (!transform)
            return;
        this.traversAllObjects(e, activeObject, canvasObjects);
    }
    watchObjectMoving() {
        // this.canvas.on("object:moving", (e) => this.on_object_move_or_scale(e));
        // this.canvas.on("object:scaling", (e) => this.on_object_move_or_scale(e));
    }
    getObjDraggingObjCoords(activeObject) {
        const bounds = activeObject.getBounds();
        const aCoords = {
            tl: new PIXI.Point(bounds.x, bounds.y),
            tr: new PIXI.Point(bounds.x + bounds.width, bounds.y),
            bl: new PIXI.Point(bounds.x, bounds.y + bounds.height),
            br: new PIXI.Point(bounds.x + bounds.width, bounds.y + bounds.height),
        };
        const centerPoint = new PIXI.Point((aCoords.tl.x + aCoords.br.x) / 2, (aCoords.tl.y + aCoords.br.y) / 2);
        const computedCenter = new PIXI.Point(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        const offsetX = centerPoint.x - computedCenter.x;
        const offsetY = centerPoint.y - computedCenter.y;
        return Object.keys(aCoords).reduce((acc, k) => {
            const key = k;
            acc[key] = new PIXI.Point(aCoords[key].x - offsetX, aCoords[key].y - offsetY);
            return acc;
        }, { c: computedCenter });
    }
    omitCoords(objCoords, type) {
        let newCoords;
        if (type === "vertical") {
            let l = ["tl", objCoords.tl];
            let r = ["tl", objCoords.tl];
            Keys(objCoords).forEach((key) => {
                if (objCoords[key].x < l[1].x) {
                    l = [key, objCoords[key]];
                }
                if (objCoords[key].x > r[1].x) {
                    r = [key, objCoords[key]];
                }
            });
            newCoords = {
                [l[0]]: l[1],
                [r[0]]: r[1],
                c: objCoords.c,
            };
        }
        else {
            let t = ["tl", objCoords.tl];
            let b = ["tl", objCoords.tl];
            Keys(objCoords).forEach((key) => {
                if (objCoords[key].y < t[1].y) {
                    t = [key, objCoords[key]];
                }
                if (objCoords[key].y > b[1].y) {
                    b = [key, objCoords[key]];
                }
            });
            newCoords = {
                [t[0]]: t[1],
                [b[0]]: b[1],
                c: objCoords.c,
            };
        }
        return newCoords;
    }
    getObjMaxWidthHeightByCoords(coords) {
        const objHeight = Math.max(Math.abs(coords.c.y - coords["tl"].y), Math.abs(coords.c.y - coords["tr"].y)) * 2;
        const objWidth = Math.max(Math.abs(coords.c.x - coords["tl"].x), Math.abs(coords.c.x - coords["tr"].x)) * 2;
        return { objHeight, objWidth };
    }
    /**
     * fabric.Object.getCenterPoint will return the center point of the object calc by mouse moving & dragging distance.
     * calcCenterPointByACoords will return real center point of the object position.
     */
    calcCenterPointByACoords(object) {
        const bounds = object.getBounds();
        return new PIXI.Point(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    }
    traversAllObjects(event, activeObject, canvasObjects) {
        const objCoordsByMovingDistance = this.getObjDraggingObjCoords(activeObject);
        const snapXPoints = [];
        const snapYPoints = [];
        for (let i = canvasObjects.length; i--;) {
            if (canvasObjects[i] === activeObject)
                continue;
            const objCoords = this.getObjDraggingObjCoords(canvasObjects[i]);
            const { objWidth, objHeight } = this.getObjMaxWidthHeightByCoords(objCoords);
            Object.keys(objCoordsByMovingDistance).forEach((point) => {
                const newCoords = canvasObjects[i].rotation !== 0
                    ? this.omitCoords(objCoords, "horizontal")
                    : objCoords;
                function calcHorizontalLineCoords(objPoint, activeObjCoords) {
                    const activeObjPoint = point;
                    let x1, x2;
                    if (objPoint === "c") {
                        x1 = Math.min(objCoords.c.x - objWidth / 2, activeObjCoords[activeObjPoint].x);
                        x2 = Math.max(objCoords.c.x + objWidth / 2, activeObjCoords[activeObjPoint].x);
                    }
                    else {
                        x1 = Math.min(objCoords[objPoint].x, activeObjCoords[activeObjPoint].x);
                        x2 = Math.max(objCoords[objPoint].x, activeObjCoords[activeObjPoint].x);
                    }
                    return { x1, x2 };
                }
                Object.keys(newCoords).forEach((objp) => {
                    const objPoint = objp;
                    const activeObjPoint = point;
                    if (this.isInRange(objCoordsByMovingDistance[activeObjPoint].y, newCoords[objPoint].y)) {
                        const y = newCoords[objPoint].y;
                        const { x1, x2 } = calcHorizontalLineCoords(objPoint, objCoordsByMovingDistance);
                        const offset = objCoordsByMovingDistance[activeObjPoint].y - y;
                        snapYPoints.push(objCoordsByMovingDistance.c.y - offset);
                        if (activeObject.aCoords) {
                            const calcCenter = this.calcCenterPointByACoords(activeObject.aCoords);
                            const { x1, x2 } = calcHorizontalLineCoords("c", { ...this.getObjDraggingObjCoords(activeObject), c: calcCenter });
                            this.horizontalLines.push({ y, x1, x2 });
                        }
                        else {
                            this.horizontalLines.push({ y, x1, x2 });
                        }
                    }
                });
            });
            Object.keys(objCoordsByMovingDistance).forEach((activePoint) => {
                const activeObjPoint = activePoint;
                const newCoords = canvasObjects[i].rotation !== 0
                    ? this.omitCoords(objCoords, "vertical")
                    : objCoords;
                function calcVerticalLineCoords(objPoint, activeObjCoords) {
                    let y1, y2;
                    if (objPoint === "c") {
                        y1 = Math.min(newCoords.c.y - objHeight / 2, activeObjCoords[activeObjPoint].y);
                        y2 = Math.max(newCoords.c.y + objHeight / 2, activeObjCoords[activeObjPoint].y);
                    }
                    else {
                        y1 = Math.min(objCoords[objPoint].y, activeObjCoords[activeObjPoint].y);
                        y2 = Math.max(objCoords[objPoint].y, activeObjCoords[activeObjPoint].y);
                    }
                    return { y1, y2 };
                }
                Object.keys(newCoords).forEach((objp) => {
                    const objPoint = objp;
                    if (this.isInRange(objCoordsByMovingDistance[activeObjPoint].x, newCoords[objPoint].x)) {
                        const x = newCoords[objPoint].x;
                        const { y1, y2 } = calcVerticalLineCoords(objPoint, objCoordsByMovingDistance);
                        const offset = objCoordsByMovingDistance[activeObjPoint].x - x;
                        snapXPoints.push(objCoordsByMovingDistance.c.x - offset);
                        if (activeObject.aCoords) {
                            const calcCenter = this.calcCenterPointByACoords(activeObject.aCoords);
                            const { y1, y2 } = calcVerticalLineCoords("c", { ...this.getObjDraggingObjCoords(activeObject), c: calcCenter });
                            this.verticalLines.push({ x, y1, y2 });
                        }
                        else {
                            this.verticalLines.push({ x, y1, y2 });
                        }
                    }
                });
            });
            this.snap({
                event,
                activeObject,
                draggingObjCoords: objCoordsByMovingDistance,
                snapXPoints,
                snapYPoints,
            });
        }
    }
    snap({ event, activeObject, snapXPoints, draggingObjCoords, snapYPoints, }) {
        const sortPoints = (list, origin) => {
            if (!list.length)
                return origin;
            return list
                .map(val => ({ abs: Math.abs(origin - val), val }))
                .sort((a, b) => a.abs - b.abs)[0].val;
        };
        const candidateSnapGlobal = new PIXI.Point(sortPoints(snapXPoints, draggingObjCoords.c.x), sortPoints(snapYPoints, draggingObjCoords.c.y));
        const pivotGlobal = activeObject.parent.toGlobal(activeObject.position);
        const bounds = activeObject.getBounds();
        const geometricCenter = new PIXI.Point(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        const offset = new PIXI.Point(geometricCenter.x - pivotGlobal.x, geometricCenter.y - pivotGlobal.y);
        const newPivotGlobal = new PIXI.Point(candidateSnapGlobal.x - offset.x, candidateSnapGlobal.y - offset.y);
        const newPivotLocal = activeObject.parent.toLocal(newPivotGlobal);
        activeObject.position.set(newPivotLocal.x, newPivotLocal.y);
    }
    clearGuideline() {
        this.graphics.clear();
    }
    watchRender() {
        this.app.ticker.add(() => {
            for (let i = this.verticalLines.length; i--;) {
                this.drawVerticalLine(this.verticalLines[i]);
            }
            for (let i = this.horizontalLines.length; i--;) {
                this.drawHorizontalLine(this.horizontalLines[i]);
            }
        });
    }
    init() {
        this.watchObjectMoving();
        this.watchRender();
        this.watchMouseDown();
        this.watchMouseUp();
        this.watchMouseWheel();
    }
}
export const transformPoint = (p, t, ignoreOffset) => {
    const pt = new PIXI.Point(p.x, p.y);
    if (ignoreOffset) {
        // Create a copy of the matrix without the translation components.
        const m = new PIXI.Matrix(t.a, t.b, t.c, t.d, 0, 0);
        return m.apply(pt);
    }
    return t.apply(pt);
};
//# sourceMappingURL=aligning_guidelines.js.map