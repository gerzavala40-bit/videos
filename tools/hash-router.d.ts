import { TemplateResult } from "@benev/slate";
type RouteHandler = (...params: string[]) => TemplateResult;
interface Routes {
    [path: string]: RouteHandler;
}
export declare class HashRouter {
    routes: Routes;
    element: HTMLDivElement;
    constructor(routes: Routes);
    getCurrentPath(): string;
    matchRoute(path: string): {
        handler: RouteHandler;
        params: string[];
    } | null;
    onHashChange(): void;
    render(handler: RouteHandler, ...params: string[]): void;
}
export {};
