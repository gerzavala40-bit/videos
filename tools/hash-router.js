import { html, render } from "@benev/slate";
export class HashRouter {
    routes;
    element;
    constructor(routes) {
        this.routes = routes;
        this.element = document.createElement("div");
        this.onHashChange = this.onHashChange.bind(this);
        window.addEventListener("hashchange", this.onHashChange);
        this.onHashChange();
    }
    getCurrentPath() {
        return window.location.hash.slice(1) || "/";
    }
    matchRoute(path) {
        for (const route in this.routes) {
            const routeParts = route.split("/");
            const pathParts = path.split("/");
            if (routeParts.includes("*")) {
                const isMatch = routeParts.every((part, index) => {
                    return part === pathParts[index] || part === "*";
                });
                if (isMatch) {
                    const wildcardIndex = routeParts.indexOf("*");
                    const wildcardValue = pathParts[wildcardIndex];
                    return { handler: this.routes[route], params: [wildcardValue] };
                }
            }
            if (route === path) {
                return { handler: this.routes[route], params: [] };
            }
        }
        return null;
    }
    onHashChange() {
        const currentPath = this.getCurrentPath();
        const matchedRoute = this.matchRoute(currentPath);
        if (matchedRoute) {
            const { handler, params } = matchedRoute;
            this.render(handler, ...params);
        }
        else if (currentPath.startsWith("editor")) {
            this.render(() => html `404 Not Found`);
        }
        else {
            this.render(this.routes["/"]); // Default to landing page
        }
    }
    render(handler, ...params) {
        render(handler(...params), this.element);
    }
}
//# sourceMappingURL=hash-router.js.map