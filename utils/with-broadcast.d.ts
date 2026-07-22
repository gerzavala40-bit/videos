import { Actions } from "../context/actions.js";
export interface BroadcastOptions {
    omit?: boolean;
}
export declare function withBroadcast<T extends (...args: any[]) => any>(action: T, broadcastFn: (actionType: keyof Actions, payload: Parameters<ReturnType<T>>) => void): (...args: Parameters<T>) => (...actionArgs: [...Parameters<ReturnType<T>>, BroadcastOptions?]) => ReturnType<T>;
