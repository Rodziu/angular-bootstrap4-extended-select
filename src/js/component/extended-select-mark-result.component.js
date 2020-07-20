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
            if (this.extendedSelect.search !== this._search) {
                this._search = this.extendedSelect.search;
                let html = this.label;
                if (angular.isString(this._search) && this._search.length) {
                    html = this.label.replace(new RegExp('(' + this._search + ')', 'gi'), '<u>$1</u>')
                }
                $element.html(html);
            }
        };
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
