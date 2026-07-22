import { EffectDrag } from "./drag-related/effect-drag.js";
import { EffectTimecode, ProposedTimecode, State } from "../../../types.js";
export declare class EffectPlacementProposal {
    #private;
    calculateProposedTimecode(effectTimecode: EffectTimecode, { grabbed, position }: EffectDrag, state: State): ProposedTimecode;
}
