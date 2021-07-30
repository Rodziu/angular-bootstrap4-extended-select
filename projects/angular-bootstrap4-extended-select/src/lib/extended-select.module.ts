/*
 * Angular Extended Select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {BsDropdownModule} from 'angular-bootstrap4';
import {ExtendedSelectComponent} from './extended-select/extended-select.component';
import {EsOptionComponent} from './es-option/es-option.component';
import {EsSearchDirective} from './es-search.directive';
import {EsDropdownDirective} from './es-dropdown.directive';
import {EsOptionGroupComponent} from './es-option-group/es-option-group.component';
import {EsOptionsDirective} from './es-options.directive';
import {EsOptionGroupsDirective} from './es-option-groups.directive';
import {EsBeforeOptionDirective} from './es-before-option.directive';

@NgModule({
    declarations: [
        EsBeforeOptionDirective,
        EsDropdownDirective,
        EsOptionComponent,
        EsOptionGroupComponent,
        EsOptionGroupsDirective,
        EsOptionsDirective,
        EsSearchDirective,
        ExtendedSelectComponent,
    ],
    imports: [
        BsDropdownModule,
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [
        EsBeforeOptionDirective,
        EsOptionComponent,
        EsOptionGroupsDirective,
        EsOptionsDirective,
        ExtendedSelectComponent
    ]
})
export class ExtendedSelectModule {

}
