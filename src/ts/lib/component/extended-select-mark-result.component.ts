/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import {ExtendedSelectComponentController} from './extended-select.component';
import * as angular from 'angular';
import {IComponentOptions} from 'angular';

/**
 * @ngInject
 */
class ExtendedSelectMarkResultComponentController {
    extendedSelect: ExtendedSelectComponentController;
    label: string;
    private _search: string;

    constructor(
        private $element: JQLite
    ) {
    }

    $doCheck(): void {
        if (this.extendedSelect.search !== this._search) {
            this._update();
        }
    }

    $onChanges(): void {
        this._update();
    }

    private _update() {
        this._search = this.extendedSelect.search;
        let html = this.label;
        if (this.label && angular.isString(this._search) && this._search.length) {
            html = this.label.replace(new RegExp('(' + this._search + ')', 'gi'), '<u>$1</u>')
        }
        this.$element.html(html);
    }
}

/**
 * @ngdoc component
 * @name extendedSelectMarkResult
 * @param {expression} label
 */
export const extendedSelectMarkResultComponent: IComponentOptions = {
    require: {
        extendedSelect: '^extendedSelect'
    },
    bindings: {
        label: '<'
    },
    controllerAs: 'vm',
    controller: ExtendedSelectMarkResultComponentController
}
