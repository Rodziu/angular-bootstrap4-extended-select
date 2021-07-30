/*
 * Angular Extended Select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import {IEsOption} from '../es-options.directive';
import {ElementRef} from '@angular/core';

export interface IEsOptionComponent<T> {
    readonly elementRef: ElementRef<HTMLElement>;
    option: IEsOption<T>;
    hidden: boolean;
    getLabel: () => string;
}
