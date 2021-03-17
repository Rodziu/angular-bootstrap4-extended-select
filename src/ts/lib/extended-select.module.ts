/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import * as angular from 'angular';
import angularBS from 'angularjs-bootstrap-4';
import {ExtendedSelectProvider} from './extended-select.provider';
import {extendedSelectConfig} from './extended-select.config';
import {ExtendedSelectOptionsService} from './service/extended-select-options.service';
import {extendedSelectComponent} from './component/extended-select.component';
import {esTranscludeDirective} from './component/es-transclude.directive';
import {extendedSelectMarkResultComponent} from './component/extended-select-mark-result.component';
import {extendedSelectOptionGroupComponent} from './component/extended-select-option-group.component';
import {extendedSelectOptionsDirective} from './component/extended-select-options.directive';
import {extendedSelectSearchDirective} from './component/extended-select-search.directive';

const extendedSelectModule = angular.module('extendedSelect', [angularBS])
    .provider('extendedSelect', ExtendedSelectProvider)
    .config(extendedSelectConfig)
    .factory('extendedSelectOptions', ExtendedSelectOptionsService)
    .component('extendedSelect', extendedSelectComponent)
    .directive('esTransclude', esTranscludeDirective)
    .component('extendedSelectMarkResult', extendedSelectMarkResultComponent)
    .component('extendedSelectOptionGroup', extendedSelectOptionGroupComponent)
    .directive('extendedSelectOptions', extendedSelectOptionsDirective)
    .directive('extendedSelectSearch', extendedSelectSearchDirective);

export const extendedSelect = extendedSelectModule.name;
