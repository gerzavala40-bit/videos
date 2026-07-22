import { Compositor } from "../controller.js";
import { Actions } from "../../../actions.js";
import { ImageEffect, VideoEffect } from "../../../types.js";
export interface Filter {
    targetEffectId: string;
    type: FilterType;
}
export declare class FiltersManager {
    #private;
    private compositor;
    private actions;
    onChange: import("@benev/slate").Pub<unknown>;
    constructor(compositor: Compositor, actions: Actions);
    selectedFilterForEffect(effect: VideoEffect | ImageEffect | null, type: FilterType): boolean | undefined;
    addFilterToEffect(effect: ImageEffect | VideoEffect, type: FilterType, recreate?: boolean): void;
    removeFilterFromEffect(effect: ImageEffect | VideoEffect, type: FilterType, recreate?: boolean): void;
    updateEffectFilter(effect: ImageEffect | VideoEffect, filterName: string, propertyPath: string | string[], value: any): void;
    createFilterPreviews(onCreatedPreview: ({ canvas, type, uid }: {
        canvas: PIXI.ICanvas;
        type: FilterType;
        uid: number;
    }) => void): Promise<void>;
}
export type ChoiceOptions = string[] | Record<string, string | number> | number[];
export type ChoiceFilterProperty = {
    type: "choice";
    options: ChoiceOptions;
    default: string | number;
};
export type NumericFilterProperty = {
    type: "number";
    min: number;
    max: number;
    default: number;
};
export type ColorFilterProperty = {
    type: "color";
    default: string;
};
export type BooleanFilterProperty = {
    type: "boolean";
    default: boolean;
};
export type ObjectFilterProperty = {
    type: "object";
    properties: Record<string, FilterPropertyConfig>;
};
export type ArrayFilterProperty = {
    type: "array";
    items: FilterPropertyConfig[];
};
export type FilterPropertyConfig = NumericFilterProperty | ColorFilterProperty | BooleanFilterProperty | ChoiceFilterProperty | ObjectFilterProperty | ArrayFilterProperty;
export type SchemaFromOptions<T> = {
    [K in keyof Required<T>]: FilterPropertyConfig;
};
export type FilterType = "BlurFilter" | "AlphaFilter" | "NoiseFilter" | "AsciiFilter" | "CRTFilter" | "PixelateFilter" | "TwistFilter" | "OldFilmFilter" | "OutlineFilter" | "RadialBlurFilter" | "ReflectionFilter" | "RGBSplitFilter" | "ShockwaveFilter" | "SimpleLightmapFilter" | "SimplexNoiseFilter" | "TiltShiftFilter" | "ZoomBlurFilter" | "AdjustmentFilter" | "AdvancedBloomFilter" | "BackdropBlurFilter" | "BevelFilter" | "BloomFilter" | "BulgePinchFilter" | "ColorGradientFilter" | "ColorMapFilter" | "ColorOverlayFilter" | "ColorReplaceFilter" | "ConvolutionFilter" | "CrossHatchFilter" | "DotFilter" | "DropShadowFilter" | "EmbossFilter" | "GlitchFilter" | "GlowFilter" | "GodrayFilter" | "GrayscaleFilter" | "HslAdjustmentFilter" | "KawaseBlurFilter" | "MotionBlurFilter";
export interface FilterSchema {
    [property: string]: FilterPropertyConfig;
}
export declare const FilterSchemas: Record<FilterType, FilterSchema>;
