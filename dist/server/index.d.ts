import type { Express } from 'express';
export declare const DEFAULT_CLIENT_DIST_PATH: string;
export interface StartServerProps {
    port?: number;
    autoFreePort?: boolean;
    clientDistPath?: string;
}
export declare function startServer(props: StartServerProps): Promise<Express>;
