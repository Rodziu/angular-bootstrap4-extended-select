/*
 * Angular Extended Select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import {
    Component,
    HostBinding,
    Input, OnInit,
    QueryList,
    ViewChildren
} from '@angular/core';
import {EsOptionsDirective} from '../es-options.directive';
import {IEsOptionComponent} from '../es-option/es-option-component.interface';
import {IEsOptionGroupComponent} from './es-option-group-component.interface';
import {IExtendedSelectComponent} from '../extended-select/extended-select-component.interface';

@Component({
    selector: 'es-option-group',
    templateUrl: './es-option-group.component.html'
})
export class EsOptionGroupComponent<T> implements OnInit, IEsOptionGroupComponent<T> {
    @Input() extendedSelect!: IExtendedSelectComponent<T>;

    @Input() esOptions!: EsOptionsDirective<T>;
    @Input() search?: string;

    @HostBinding() hidden = false;

    @ViewChildren('esOption') optionComponents?: QueryList<IEsOptionComponent<T>>;

    ngOnInit(): void {
        const searchValue = typeof this.extendedSelect.searchControl.value === 'string'
            ? this.extendedSelect.searchControl.value
            : '';
        this.hidden = searchValue.length < this.extendedSelect.typeToSearch;
    }
}
