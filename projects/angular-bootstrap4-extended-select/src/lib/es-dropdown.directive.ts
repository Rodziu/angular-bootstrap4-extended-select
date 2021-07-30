/*
 * Angular Extended Select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import {
    AfterContentInit,
    Directive,
    ElementRef,
    Input,
    OnDestroy,
} from '@angular/core';
import {BsHelpers} from 'angular-bootstrap4';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {IEsOption} from './es-options.directive';
import {IExtendedSelectComponent} from './extended-select/extended-select-component.interface';

@Directive({
    selector: '[esDropdown]'
})
export class EsDropdownDirective<T> implements AfterContentInit, OnDestroy {
    private readonly _destroy$ = new Subject<void>();
    private previousLength = -1;
    private extendedSelect!: IExtendedSelectComponent<T>;

    @Input() set esDropdown(extendedSelect: IExtendedSelectComponent<T>) {
        this.extendedSelect = extendedSelect;
    }

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private helpers: BsHelpers
    ) {
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    ngAfterContentInit(): void {
        this.extendedSelect.highlightedOption$
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                this._scroll();
            });
        this.extendedSelect.page$
            .pipe(takeUntil(this._destroy$))
            .subscribe((page) => {
                if (page > 1) {
                    // when loading next page in resolve mode, we need to scroll to top of last option
                    // from previous page. When page$ emits new options are not yet rendered so it will be the
                    // last of currently visible options.
                    const visibleOptions = this.extendedSelect.getVisibleOptions();

                    if (visibleOptions.length) {
                        setTimeout(() => { // setTimeout, so we scroll when new options are rendered
                            this._scroll(visibleOptions[visibleOptions.length - 1], true);
                        });
                    }
                }
            });
        this.extendedSelect.isOpen$
            .pipe(takeUntil(this._destroy$))
            .subscribe((isOpen) => {
                if (isOpen) {
                    setTimeout(() => { // wait until dropdown is shown
                        this._scroll();
                    });
                } else {
                    this.previousLength = -1;
                }
            });
    }

    private _scroll(option?: IEsOption<T>, forceToBegin = false): void {
        if (!this.extendedSelect.isOpen || !this.extendedSelect.optionGroups) {
            return;
        }

        if (!this.extendedSelect.highlightedOption && !option) {
            this.elementRef.nativeElement.scrollTop = 0;
            return;
        }

        this.extendedSelect.optionGroups.find((esOptionGroup) => {
            const esOption = esOptionGroup.optionComponents?.find((esOption) => {
                return esOption.option === (option || this.extendedSelect.highlightedOption);
            });

            if (esOption) {
                const element = esOption.elementRef.nativeElement.firstChild as HTMLElement;

                const top = element.offsetTop,
                    scroll = this.elementRef.nativeElement.scrollTop,
                    bot = this.helpers.offset(element).height + top,
                    ulHeight = this.helpers.offset(this.elementRef.nativeElement).height;

                if (forceToBegin || scroll - top > 0) { // move it up
                    this.elementRef.nativeElement.scrollTop = top;
                } else if (scroll - bot < ulHeight * -1) { // move it down
                    this.elementRef.nativeElement.scrollTop = bot - ulHeight;
                }
                return true;
            }

            return false;
        })
    }
}
