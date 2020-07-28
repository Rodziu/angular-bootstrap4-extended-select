/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2020 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!(function() {
    'use strict';

    function extendedSelectMarkResultController($element) {
        const ctrl = this;
        ctrl.$doCheck = function() {
            if (ctrl.extendedSelect.search !== ctrl._search) {
                _update();
            }
        };

        ctrl.$onChanges = function() {
            _update();
        };

        //////

        function _update() {
            ctrl._search = ctrl.extendedSelect.search;
            let html = ctrl.label;
            if (ctrl.label && angular.isString(ctrl._search) && ctrl._search.length) {
                html = ctrl.label.replace(new RegExp('(' + ctrl._search + ')', 'gi'), '<u>$1</u>')
            }
            $element.html(html);
        }
    }

    angular.module('extendedSelect').component('extendedSelectMarkResult', {
        require: {
            extendedSelect: '^extendedSelect'
        },
        bindings: {
            label: '<'
        },
        controllerAs: 'vm',
        controller: extendedSelectMarkResultController
    })
}());
