import { Router } from 'express';
import { ISwaggerBuildDefinition } from './swagger.builder';
import { ISwagger } from './i-swagger';
export interface ISwaggerExpressOptions {
    /**
     * Path of resource.
     * Default is "/api-docs/swagger.json".
     */
    path?: string;
    /**
     * Swagger Definition.
     */
    definition?: ISwaggerBuildDefinition;
}
export declare function express(options?: ISwaggerExpressOptions): Router;
export declare function docsJson(options: ISwaggerBuildDefinition): ISwagger;
