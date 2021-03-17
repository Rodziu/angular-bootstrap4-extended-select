/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import {ICompiledExpression, IParseService} from 'angular';

/**
 * Parse ng-options in angular way.
 * 1: value expression (valueFn)
 * 2: label expression (displayFn)
 * 3: group by expression (groupByFn)
 * 4: nested by expression (nestedByFn)
 * 5: disable when expression (disableWhenFn)
 * 6: array item variable name
 * 7: object item key variable name
 * 8: object item value variable name
 * 9: collection expression
 * 10: track by expression
 * @type {RegExp}
 */
// eslint-disable-next-line max-len
const NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?)(?:\s+nested\s+by\s+([\s\S]+?))?)?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([$\w][$\w]*)|(?:\(\s*([$\w][$\w]*)\s*,\s*([$\w][$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;

export interface IParsedNgOptions {
    valueFn: ICompiledExpression,
    displayFn: ICompiledExpression,
    groupByFn: ICompiledExpression,
    nestedByFn: ICompiledExpression,
    valuesFn: ICompiledExpression,
    getLocals: (key: unknown, value: unknown) => Record<string, unknown>
}

export class ExtendedSelectOptionsService {
    constructor(
        private $parse: IParseService
    ) {
    }

    parseNgOptions(ngOptionsString: string): IParsedNgOptions {
        const match = ngOptionsString.match(NG_OPTIONS_REGEXP);
        if (match === null) {
            return null;
        }
        const valueName = match[6] || match[8],
            keyName = match[7];
        return {
            valueFn: this.$parse(match[2] ? match[1] : valueName),
            displayFn: this.$parse(match[2] || match[1]),
            groupByFn: this.$parse(match[3] || ''),
            nestedByFn: this.$parse(match[4] || ''),
            valuesFn: this.$parse(match[9]),
            getLocals: (key, value) => {
                const locals = {};
                locals[valueName] = value;
                if (keyName) {
                    locals[keyName] = key;
                }
                return locals;
            }
        };
    }
}
