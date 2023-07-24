import { ServerStorageName } from '@nicepkg/gpt-runner-shared/common';
export interface HandleStorageKeySetParams {
    key: string;
    value: any;
    storageName: ServerStorageName;
}
export declare function handleStorageKeySet(params: HandleStorageKeySetParams): Promise<void>;
