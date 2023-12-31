import { IApiModelArgs } from '.';
import { IApiModelPropertyArgs } from './api-model-property.decorator';
import { IApiOperationGetArgs } from './api-operation-get.decorator';
import { IApiOperationPostArgs } from './api-operation-post.decorator';
import { IApiPathArgs } from './api-path.decorator';
import { IApiOperationArgsBaseResponse } from './i-api-operation-args.base';
import { ISwagger, ISwaggerExternalDocs, ISwaggerInfo, ISwaggerOperation } from './i-swagger';
import { ISwaggerBuildDefinition, ISwaggerBuildDefinitionModel, ISwaggerSecurityDefinition } from './swagger.builder';
interface IPath {
    path: string;
    get?: ISwaggerOperation;
    post?: ISwaggerOperation;
    put?: ISwaggerOperation;
    patch?: ISwaggerOperation;
    delete?: ISwaggerOperation;
}
interface IController {
    path?: string;
    paths?: {
        [key: string]: IPath;
    };
    name?: string;
    description?: string;
    security?: {
        [key: string]: any[];
    };
    deprecated?: boolean;
    groupProtalName?: string;
}
export declare class SwaggerService {
    static getInstance(): SwaggerService;
    private static instance;
    private controllerMap;
    private data;
    private modelsMap;
    private globalResponses;
    resetData(): void;
    getData(): ISwagger;
    setBasePath(basePath: string): void;
    setOpenapi(openapi: string): void;
    setInfo(info: ISwaggerInfo): void;
    setSchemes(schemes: string[]): void;
    setProduces(produces: string[]): void;
    setConsumes(consumes: string[]): void;
    setHost(host: string): void;
    setDefinitions(models: {
        [key: string]: ISwaggerBuildDefinitionModel;
    }): void;
    setExternalDocs(externalDocs: ISwaggerExternalDocs): void;
    setGlobalResponses(globalResponses: {
        [key: string]: IApiOperationArgsBaseResponse;
    }): void;
    addPath(args: IApiPathArgs, target: any): void;
    addOperationGet(args: IApiOperationGetArgs, target: any, propertyKey: string | symbol): void;
    addOperationPost(args: IApiOperationPostArgs, target: any, propertyKey: string | symbol): void;
    addOperationPut(args: IApiOperationPostArgs, target: any, propertyKey: string | symbol): void;
    addOperationPatch(args: IApiOperationPostArgs, target: any, propertyKey: string | symbol): void;
    addOperationDelete(args: IApiOperationPostArgs, target: any, propertyKey: string | symbol): void;
    addSecurityDefinitions(securityDefinitions: {
        [key: string]: ISwaggerSecurityDefinition;
    }): void;
    buildSwagger(controllerMap: {
        [key: string]: IController;
    }): ISwagger;
    getDefinition(definition: ISwaggerBuildDefinition): ISwagger;
    addApiModelProperty(args: IApiModelPropertyArgs, target: any, propertyKey: string | symbol, propertyType: string): void;
    addApiModel(args: IApiModelArgs, target: any): any;
    private initData;
    private addOperation;
    private buildOperation;
    private buildOperationResponses;
    private buildBodyOperationParameter;
    private buildOperationSecurity;
    private buildParameters;
    private buildSwaggerOperation;
    private buildRef;
}
export {};
