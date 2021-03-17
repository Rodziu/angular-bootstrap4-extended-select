/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import {IDirective} from 'angular';
import {AngularBSService} from 'angularjs-bootstrap-4';

/**
 * @ngInject
 */
class ExtendedSelectOptionsDirectiveController {
    activeIndex: number;

    constructor(
        private $element: JQLite,
        private angularBS: AngularBSService
    ) {
    }

    $onChanges(): void { // it's always an activeIndex change
        const item = this.$element[0].querySelector(
            `.dropdown-item:nth-child(${this.activeIndex + 1})`
        ) as HTMLDivElement;
        if (item === null) {
            return;
        }
        const top = item.offsetTop,
            scroll = this.$element[0].scrollTop,
            bot = this.angularBS.offset(item).height + top,
            ulHeight = this.angularBS.offset(this.$element[0]).height;
        if (scroll - top > 0) { // move it up
            this.$element[0].scrollTop = top;
        } else if (scroll - bot < ulHeight * -1) { // move it down
            this.$element[0].scrollTop = bot - ulHeight;
        }
    }
}

export function extendedSelectOptionsDirective(): IDirective {
    /**
     * @ngdoc directive
     * @name extendedSelectOptions
     * @description automatically scroll dropdown window to highlighted option
     */
    return {
        restrict: 'A',
        bindToController: {
            activeIndex: '<extendedSelectOptions'
        },
        controller: ExtendedSelectOptionsDirectiveController
    };
}
