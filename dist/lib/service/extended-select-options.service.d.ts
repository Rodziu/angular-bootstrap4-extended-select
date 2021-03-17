import { ICompiledExpression, IParseService } from 'angular';
export interface IParsedNgOptions {
    valueFn: ICompiledExpression;
    displayFn: ICompiledExpression;
    groupByFn: ICompiledExpression;
    nestedByFn: ICompiledExpression;
    valuesFn: ICompiledExpression;
    getLocals: (key: unknown, value: unknown) => Record<string, unknown>;
}
export declare class ExtendedSelectOptionsService {
    private $parse;
    constructor($parse: IParseService);
    parseNgOptions(ngOptionsString: string): IParsedNgOptions;
}
