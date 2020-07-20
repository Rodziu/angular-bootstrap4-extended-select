/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name extendedSelectOptions
     * @description automatically scroll dropdown window to highlighted option
     */
    function extendedSelectOptionsDirective() {
        return {
            restrict: 'A',
            bindToController: {
                activeIndex: '<extendedSelectOptions'
            },
            controller: ['$element', 'angularBS', function($element, angularBS) {
                const ctrl = this;
                ctrl.$onChanges = function() { // it's always an activeIndex change
                    const item = $element[0].querySelector(
                        `.dropdown-item:nth-child(${ctrl.activeIndex + 1})`
                    );
                    if (item === null) {
                        return;
                    }
                    const top = item.offsetTop,
                        scroll = $element[0].scrollTop,
                        bot = angularBS.offset(item).height + top,
                        ulHeight = angularBS.offset($element[0]).height;
                    if (scroll - top > 0) { // move it up
                        $element[0].scrollTop = top;
                    } else if (scroll - bot < ulHeight * -1) { // move it down
                        $element[0].scrollTop = bot - ulHeight;
                    }
                };
            }]
        };
    }

    angular.module('extendedSelect').directive('extendedSelectOptions', extendedSelectOptionsDirective);
}());
