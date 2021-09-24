/*
 * Angular Extended Select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import {Directive, ElementRef, HostBinding, HostListener, Input, OnInit} from '@angular/core';
import {IExtendedSelectComponent} from './extended-select/extended-select-component.interface';

@Directive({
    selector: '[esSearch]'
})
export class EsSearchDirective<T> implements OnInit {
    @HostBinding() placeholder?: string;

    @Input() set esSearch(extendedSelect: IExtendedSelectComponent<T>) {
        this.extendedSelect = extendedSelect;
    }

    private extendedSelect!: IExtendedSelectComponent<T>

    constructor(
        private elementRef: ElementRef<HTMLElement>,
    ) {
    }

    ngOnInit(): void {
        if (this.extendedSelect.multiple) {
            this.placeholder = !this.extendedSelect.currentOptions?.length ? this.extendedSelect.placeholder : '';
        } else {
            const span = this.elementRef.nativeElement.parentElement?.querySelector('span');
            if (span) {
                this.placeholder = (span.textContent || '').trim();
            }
        }
        this.elementRef.nativeElement.focus();
    }

    @HostListener('keydown', ['$event']) keydown(e: KeyboardEvent): void {
        e.stopPropagation();

        if (!this.extendedSelect.esOptionsList || !this.extendedSelect.optionGroups) {
            return;
        }

        const visibleOptions = this.extendedSelect.getVisibleOptions()
            .filter((option) => !this.extendedSelect.isSelected(option));

        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowUp': {
                if (visibleOptions.length) {
                    const idx = this.extendedSelect.highlightedOption
                        ? visibleOptions.indexOf(this.extendedSelect.highlightedOption)
                        : -1;

                    const nextIndex = e.key === 'ArrowDown' ? idx + 1 : idx - 1;

                    if (typeof visibleOptions[nextIndex] !== 'undefined') {
                        this.extendedSelect.highlightedOption = visibleOptions[nextIndex];
                    }
                }
                break;
            }
            case 'Enter': {
                if (!visibleOptions.length) {
                    this.extendedSelect.addOptionAction();
                }
                if (this.extendedSelect.highlightedOption) {
                    this.extendedSelect.pickOption(this.extendedSelect.highlightedOption);
                }
            }
        }
    }
}
