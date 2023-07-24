export interface GetFinalPathParams {
    path: string | undefined | null;
    rootPath?: string;
    fieldName: string;
    assertType: 'directory' | 'file';
}
export declare function getValidFinalPath(params: GetFinalPathParams): string;
