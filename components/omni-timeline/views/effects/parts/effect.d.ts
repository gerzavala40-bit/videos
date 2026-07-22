import { CSSResultGroup, TemplateResult, GoldElement } from "@benev/slate";
import { AnyEffect } from "../../../../../context/types.js";
export declare const Effect: (props: [timeline: GoldElement, any_effect: AnyEffect, content: TemplateResult, style?: CSSResultGroup | undefined, inline_css?: string | undefined], meta?: Partial<{
    content: TemplateResult<1 | 2>;
    auto_exportparts: boolean;
    attrs: import("@benev/slate").ShadowAttrs;
}> | undefined) => import("@benev/slate").DirectiveResult<any>;
