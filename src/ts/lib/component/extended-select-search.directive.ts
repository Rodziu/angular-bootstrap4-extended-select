/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import IInjectorService = angular.auto.IInjectorService;
import {IDirective} from 'angular';
import * as angular from 'angular';

export function extendedSelectSearchDirective($injector: IInjectorService): IDirective {
    /**
     * @ngdoc directive
     * @name extendedSelectSearch
     * @description search element
     */
    return {
        restrict: 'A',
        require: '^extendedSelect',
        link: function(scope, element, attrs, ctrl) {
            if ($injector.has('$animate')) {
                ($injector.get('$animate') as angular.animate.IAnimateService).enabled(element, false);
            }
            element[0].focus();
            /**
             * move selection or pick an option on keydown
             */
            element.on('keydown', function(e) {
                e.stopPropagation();
                if (!ctrl.optionsFiltered.length) {
                    if (e.which === 13) {
                        ctrl.addOptionAction();
                        ctrl.$scope.$apply();
                    }
                    return;
                }
                const originalIndex = ctrl.activeIndex;
                switch (e.which) {
                    case 40: // down
                        do {
                            ctrl.activeIndex++;
                            if (ctrl.activeIndex >= ctrl.optionsFiltered.length) {
                                ctrl.activeIndex = originalIndex;
                                break;
                            }
                        } while (ctrl.multiple && ctrl.isSelected(ctrl.optionsFiltered[ctrl.activeIndex]));
                        break;
                    case 38: // up
                        do {
                            ctrl.activeIndex--;
                            if (ctrl.activeIndex < 0) {
                                ctrl.activeIndex = originalIndex;
                                break;
                            }
                        } while (ctrl.multiple && ctrl.isSelected(ctrl.optionsFiltered[ctrl.activeIndex]));
                        break;
                    case 13: // enter
                        if (angular.isDefined(ctrl.optionsFiltered[ctrl.activeIndex])) {
                            ctrl.pickOption(ctrl.optionsFiltered[ctrl.activeIndex]);
                            ctrl.$scope.$apply();
                            return;
                        }
                        break;
                }
                ctrl.$scope.$digest();
            });
        }
    };
}
