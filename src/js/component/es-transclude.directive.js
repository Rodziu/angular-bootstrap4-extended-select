/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name esTransclude
     */
    function esTranscludeDirective() {
        return {
            restrict: 'A',
            require: '^extendedSelect',
            link: function(scope, element, attrs, ctrl, transclude) {
                const slots = attrs['esTransclude'] ? [attrs['esTransclude']] : ['optionTemplate', 'beforeOption'];
                slots.forEach((slot) => {
                    if (transclude.isSlotFilled(slot)) {
                        transclude((clone, transcludedScope) => {
                            transcludedScope.$extendedSelect = ctrl;
                            transcludedScope.$option = scope['o'];
                            transcludedScope.$isOption = true;
                            if (angular.isUndefined(scope['o'])) {
                                transcludedScope.$isOption = false;
                                if (ctrl.multiple) {
                                    transcludedScope.$option = {
                                        value: scope['m'],
                                        label: ctrl.getModelLabel(scope['m'])
                                    };
                                } else {
                                    transcludedScope.$watch(() => {
                                        return ctrl.ngModel;
                                    }, () => {
                                        transcludedScope.$option = {
                                            value: ctrl.ngModel,
                                            label: ctrl.getModelLabel()
                                        };
                                    });
                                }
                            }
                            if (slot === 'optionTemplate') {
                                element.contents().replaceWith(clone);
                            } else {
                                element.prepend(clone);
                            }
                        }, null, slot);
                    }
                });
            }
        }
    }

    angular.module('extendedSelect').directive('esTransclude', esTranscludeDirective);
}());
