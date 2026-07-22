import { ZipAction } from "@benev/slate/x/watch/zip/action.js";
import { State, HistoricalState, NonHistoricalState } from "../context/types.js";
export declare const actionize_historical: <B extends ZipAction.Blueprint<HistoricalState>>(blueprint: B) => B;
export declare const actionize_non_historical: <B extends ZipAction.Blueprint<NonHistoricalState>>(blueprint: B) => B;
export declare const actionize: <B extends ZipAction.Blueprint<State>>(blueprint: B) => B;
