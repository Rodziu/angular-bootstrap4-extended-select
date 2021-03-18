/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import IProvideService = angular.auto.IProvideService;
import * as angular from 'angular';
import {IDirective} from 'angular';

/**
 * Prevent ng-options directive from compiling on angular-extended-select
 * @ngInject
 */
export function extendedSelectConfig($provide: IProvideService): void {
    const blocked = ['ngOptions', 'select'];
    angular.forEach(blocked, function(directiveName) {
        $provide.decorator(directiveName + 'Directive', ['$delegate', function($delegate) {
            angular.forEach($delegate, function(directive: IDirective) {
                const compile_ = directive.compile || angular.noop;
                directive.compile = function(element, attrs, transclude) {
                    if (element[0].tagName === 'EXTENDED-SELECT') {
                        directive.terminal = false;
                        return;
                    }
                    return compile_.apply(this, [element, attrs, transclude]) || directive.link;
                };
            });
            return $delegate;
        }]);
    });
}
