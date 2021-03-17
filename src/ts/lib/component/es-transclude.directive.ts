/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import {IDirective, IScope} from 'angular';
import * as angular from 'angular';
import {ExtendedSelectComponentController, IExtendedSelectOption} from './extended-select.component';

interface IEsTranscludeScope extends IScope {
    $extendedSelect: ExtendedSelectComponentController,
    $option: IExtendedSelectOption,
    $isOption: boolean
}

export function esTranscludeDirective(): IDirective {
    /**
     * @ngdoc directive
     * @name esTransclude
     */
    return {
        restrict: 'A',
        require: '^extendedSelect',
        link: function(
            scope,
            element,
            attrs,
            ctrl: ExtendedSelectComponentController,
            transclude
        ) {
            const slots = attrs['esTransclude'] ? [attrs['esTransclude']] : ['optionTemplate', 'beforeOption'];
            slots.forEach((slot) => {
                if (transclude.isSlotFilled(slot)) {
                    transclude((clone, transcludedScope: IEsTranscludeScope) => {
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
