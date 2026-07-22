import { LitElement } from "lit";
export declare class LandingPage extends LitElement {
    static styles: import("lit").CSSResult;
    menuOpened: boolean;
    currentTransition: string;
    transitionsDropdownOpen: boolean;
    transitionsVideo: null | HTMLVideoElement;
    interval: number;
    toggleTransitionsDropdown: (e: MouseEvent) => void;
    closeTransitionsDropdown: (e: MouseEvent) => void;
    menuClick: (e: MouseEvent) => void;
    setCurrentTransition(e: Event): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    getCurrentPath(): string;
    scrollIntoElementView(id: string): void;
    render(): import("lit-html").TemplateResult<1>;
}
