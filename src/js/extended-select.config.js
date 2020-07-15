/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!(function() {
    'use strict';

    /**
	 * Prevent ng-options directive from compiling on angular-extended-select
	 */
    function extendedSelectConfig($provide) {
        const blocked = ['ngOptions', 'select'];
        angular.forEach(blocked, function(d) {
            $provide.decorator(d + 'Directive', ['$delegate', function($delegate) {
                angular.forEach($delegate, function(directive) {
                    const compile_ = directive.compile || function() {
                    };
                    directive.compile = function(element) {
                        if (element[0].tagName === 'EXTENDED-SELECT') {
                            return;
                        }
                        return compile_.apply(this, arguments) || directive.link;
                    };
                });
                return $delegate;
            }]);
        });
    }

    angular.module('extendedSelect').config(extendedSelectConfig);
}());
