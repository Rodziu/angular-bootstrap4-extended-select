/*
 * Angular Extended Select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import {Directive, Input, TemplateRef} from '@angular/core';

export interface IEsBeforeOptionContext<T> {
    $implicit: T | undefined
}

@Directive({
    selector: '[esBeforeOption]'
})
export class EsBeforeOptionDirective<T, U extends Array<T> = Array<T>> {
    @Input() esBeforeOptionOptions?: U;

    constructor(
        public readonly template: TemplateRef<IEsBeforeOptionContext<U extends Array<infer P> ? P : unknown>>
    ) {
    }
}
