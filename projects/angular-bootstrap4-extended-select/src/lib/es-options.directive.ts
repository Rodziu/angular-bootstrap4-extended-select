/*
 * Angular Extended Select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import {
    Directive,
    DoCheck, Host,
    Input, IterableDiffer,
    IterableDiffers, Optional,
    TemplateRef
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {EsOptionGroupsDirective} from './es-option-groups.directive';

export interface IEsOptionGroupItem {
    name: string,
    parentGroup?: string,
    children: IEsOptionGroupItem[],
    level: number,
    parent?: IEsOptionGroupItem
}

export interface IEsOption<T> {
    item: T,
    esOptions: EsOptionsDirective<T>,
    getValue: () => T | unknown,
    group?: IEsOptionGroupItem
}

export interface IEsOptionsContext<T> {
    $implicit: T
}

@Directive({
    selector: '[esOptions][esOptionsOf]'
})
export class EsOptionsDirective<T, U extends Array<T> = Array<T>> implements DoCheck {
    @Input() esOptionsOf?: U;
    @Input() esOptionsValue?: U extends (infer S)[] ? keyof S : never;
    @Input() esOptionsGroup?: string;

    options = new BehaviorSubject<IEsOption<T>[]>([]);
    level = 0;

    private _differ?: IterableDiffer<T>;

    constructor(
        public readonly template: TemplateRef<IEsOptionsContext<U extends (infer S)[] ? S : never>>,
        private _iterableDiffers: IterableDiffers,
        @Host() @Optional() group: EsOptionGroupsDirective<unknown>
    ) {
        // at creation time, EsOptionsGroups will contain current tree level
        this.level = group ? group.level : 0;
    }


    ngDoCheck(): void {
        if (!this._differ && this.esOptionsOf) {
            try {
                this._differ = this._iterableDiffers.find(this.esOptionsOf).create<T>();
            } catch {
                throw new Error(
                    `Cannot find a differ supporting object '${this.esOptionsOf}' of type 
                    '${typeof this.esOptionsOf}'. esOptionsOf only supports binding to Arrays.`
                );
            }
        }

        if (this._differ) {
            const changes = this._differ.diff(this.esOptionsOf);
            if (changes) {
                const currentOptions = this.options.value;
                changes.forEachOperation((record, adjustedPreviousIndex, currentIndex) => {
                    if (record.previousIndex === null) {
                        currentOptions.push(this._parseOption(record.item));
                    } else if (currentIndex === null) {
                        currentOptions.splice(record.previousIndex, 1);
                    } else if (adjustedPreviousIndex !== null) {
                        const item = currentOptions[adjustedPreviousIndex];
                        currentOptions.splice(adjustedPreviousIndex, 1);
                        currentOptions.splice(currentIndex, 0, item);
                    }
                })
                this.options.next(currentOptions);
            }
        }
    }

    private _parseOption(item: T): IEsOption<T> {
        return {
            item,
            esOptions: this,
            getValue: () => {
                if (
                    this.esOptionsValue
                    && typeof item === 'object' && item !== null
                    && this.esOptionsValue in item
                ) {
                    return item[this.esOptionsValue];
                }
                return item;
            }
        }
    }
}
