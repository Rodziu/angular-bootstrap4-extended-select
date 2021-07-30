/*
 * Angular Extended Select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import {
    Component,
    ElementRef,
    HostBinding,
    Input,
} from '@angular/core';
import {IEsOption} from '../es-options.directive';
import {IEsOptionComponent} from './es-option-component.interface';
import {IEsOptionGroupComponent} from '../es-option-group/es-option-group-component.interface';
import {IExtendedSelectComponent} from '../extended-select/extended-select-component.interface';

@Component({
    selector: 'es-option',
    templateUrl: './es-option.component.html'
})
export class EsOptionComponent<T> implements IEsOptionComponent<T> {
    @Input() set esOptionGroup(esOptionGroup: IEsOptionGroupComponent<T>) {
        this.extendedSelect = esOptionGroup.extendedSelect;
    }
    @Input() option!: IEsOption<T>;

    @HostBinding() hidden = false;

    extendedSelect!: IExtendedSelectComponent<T>;

    constructor(
        public readonly elementRef: ElementRef<HTMLElement>
    ) {
    }

    getLabel(): string {
        return this.elementRef.nativeElement.textContent || '';
    }
}
