import { IImportResolver } from './IImportResolver';
export { MapImportResolver } from './Map/MapImportResolver.class';
export { UrlImportResolver } from './Url/UrlImportResolver.class';
export { GitHubImportResolver } from './GitHub/GitHubImportResolver.class';
export { FileImportResolver } from './File/FileImportResolver.class';
export { ChainImportResolver } from './Chain/ChainImportResolver.class';
export { FunctionImportResolver } from './Function/FunctionImportResolver.class';
export { BaseImportResolver } from './BaseImportResolver';
type TImportResolver = {
    [key: string]: IImportResolver;
};
export declare const ImportResolver: TImportResolver;
export declare function registerImportResolver(name: string, resolver: IImportResolver): void;
