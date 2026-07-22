import { LitElement } from "lit";
import { TemplateResult } from "@benev/slate";
import { HistoricalState } from "../../context/types.js";
import { Project } from "../../context/controllers/project/controller.js";
export declare class OmniManager extends LitElement {
    project: Project;
    static styles: import("lit").CSSResult;
    joiningInProgress: boolean;
    sessionError: unknown;
    private inviteID;
    projects: HistoricalState[];
    loadProjects(): void;
    removeProject(projectId: string, prefix: string): void;
    connectedCallback(): void;
    showToast(message: string, type: "error" | "warning" | "info"): void;
    joinRoom(): Promise<void>;
    handleCollaborationUI(content: TemplateResult): import("lit-html").TemplateResult<1>;
    setInviteId(str: string): void;
    render(): import("lit-html").TemplateResult<1>;
}
