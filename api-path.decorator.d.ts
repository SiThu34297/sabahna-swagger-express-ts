export interface IApiPathArgs {
    path: string;
    name: string;
    description?: string;
    security?: {
        [key: string]: any[];
    };
    deprecated?: boolean;
    groupProtalName?: string;
}
export declare function ApiPath(args: IApiPathArgs): ClassDecorator;
