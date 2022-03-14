/*
 * Angular Extended Select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import {
    AfterViewInit,
    Component, ContentChild,
    ContentChildren, ElementRef,
    Input,
    OnDestroy, OnInit,
    QueryList, ViewChild, ViewChildren,
} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {first, startWith, takeUntil} from 'rxjs/operators';
import {ExtendedSelectConfigService} from '../extended-select-config.service';
import {EsOptionsDirective, IEsOption} from '../es-options.directive';
import {EsBeforeOptionDirective} from '../es-before-option.directive';
import {IEsOptionGroupComponent} from '../es-option-group/es-option-group-component.interface';
import {IEsOptionComponent} from '../es-option/es-option-component.interface';
import {IExtendedSelectComponent, IResolveOnSearchResult} from './extended-select-component.interface';
import isEqual from 'lodash.isequal';

@Component({
    selector: 'extended-select',
    templateUrl: './extended-select.component.html',
    styleUrls: ['./extended-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ExtendedSelectComponent
        }
    ]
})
export class ExtendedSelectComponent<T = unknown> implements AfterViewInit, OnInit, OnDestroy,
    ControlValueAccessor, IExtendedSelectComponent<T> {

    @Input() multiple = false;
    @Input() typeToSearch: number;
    @Input() searchByValue: boolean;
    @Input() placeholder?: string;
    @Input() resolveOnSearch?: (value: string, page: number) => Observable<IResolveOnSearchResult<T>>;
    @Input() addOption?: (value: string) => void;
    @Input() deselectable = false;
    @Input() deselectValue?: unknown;
    @Input() size?: 'sm' | 'lg';

    @ContentChildren(EsOptionsDirective, {descendants: true}) esOptionsList?: QueryList<EsOptionsDirective<T>>;
    @ContentChild(EsBeforeOptionDirective) esBeforeOption?: EsBeforeOptionDirective<T>;

    @ViewChild('currentOptionHTML') currentOptionHTML?: ElementRef<HTMLElement>;

    @ViewChildren('esOptionGroup') optionGroups?: QueryList<IEsOptionGroupComponent<T>>;
    private _optionGroupChildReferences = new Map<IEsOptionGroupComponent<T>, IEsOptionGroupComponent<T>[]>();

    isOpen$ = new BehaviorSubject(false);

    set isOpen(isOpen: boolean) {
        this.isOpen$.next(isOpen);
    }

    get isOpen(): boolean {
        return this.isOpen$.value;
    }

    isDisabled = false;

    currentValue?: unknown;
    currentOption?: IEsOption<T>;
    currentOptions?: IEsOption<T>[];
    visibleOptions?: T[]

    loading = false;
    searchControl = new FormControl();

    hasNextPage = false;
    page$ = new BehaviorSubject(1);

    set page(page: number) {
        this.page$.next(page);
    }

    get page(): number {
        return this.page$.value;
    }

    highlightedOption$ = new BehaviorSubject<IEsOption<T> | undefined>(undefined);

    set highlightedOption(option: IEsOption<T> | undefined) {
        this.highlightedOption$.next(option);
    }

    get highlightedOption(): IEsOption<T> | undefined {
        return this.highlightedOption$.value;
    }

    private _onChange?: (value: unknown) => void;
    private _onTouched?: () => void;
    private _wasTouched = false;
    private readonly _destroy$ = new Subject<void>();
    private _lastResolve: { timeout: number | null, subscription: Subscription | null } = {
        timeout: null,
        subscription: null
    };

    constructor(
        public config: ExtendedSelectConfigService
    ) {
        this.typeToSearch = this.config.typeToSearch;
        this.searchByValue = this.config.searchByValue;
    }

    writeValue(obj: unknown): void {
        this.currentValue = obj;
        this._updateCurrentOption(obj);
    }

    registerOnChange(fn: (value: unknown) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    markAsTouched(): void {
        if (!this._wasTouched && this._onTouched) {
            this._wasTouched = true;
            this._onTouched();
        }
    }

    ngOnInit(): void {
        if (!this.placeholder) {
            this.placeholder = this.multiple ? this.config.placeholder : this.config.placeholderMultiple;
        }

        this.isOpen$
            .pipe(takeUntil(this._destroy$))
            .subscribe((isOpen) => {
                if (!isOpen && this.searchControl.value) {
                    this.searchControl.setValue('');
                }
            });

        this.searchControl.valueChanges
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                this.hasNextPage = false;
                if (this.resolveOnSearch) {
                    this.resolveOptions();
                } else {
                    this._updateOptionsVisibility();
                }
            });
    }

    ngAfterViewInit(): void {
        this.optionGroups?.changes
            .pipe(startWith(this.optionGroups), takeUntil(this._destroy$))
            .subscribe((value: QueryList<IEsOptionGroupComponent<T>>) => {
                this._optionGroupChildReferences.clear();

                value.forEach((group, idx) => {
                    const children = [];
                    for (let i = idx + 1; i < value.length; i++) {
                        const child = value.get(i) as IEsOptionGroupComponent<T>;
                        if (child.esOptions.level <= group.esOptions.level) {
                            break;
                        }
                        if (child.esOptions.level > group.esOptions.level + 1) {
                            continue;
                        }
                        children.push(child);
                    }
                    this._optionGroupChildReferences.set(group, children);
                });
            });

        if (this.currentValue) {
            this._updateCurrentOption(this.currentValue);
        }
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    getVisibleOptions(): IEsOption<T>[] {
        const visibleOptions: IEsOption<T>[] = [];

        this.optionGroups?.forEach((esOptionGroup) => {
            if (!esOptionGroup.hidden) {
                esOptionGroup.optionComponents?.forEach((esOption) => {
                    if (!esOption.hidden) {
                        visibleOptions.push(esOption.option);
                    }
                });
            }
        });

        return visibleOptions;
    }

    open(): void {
        const wasOpen = this.isOpen;
        this.markAsTouched();
        if (this.isDisabled) {
            this.isOpen = false;
        } else {
            this.isOpen = this.multiple ? true : !this.isOpen;
        }
        if (!wasOpen && this.isOpen) {
            if (this.searchControl.value) {
                this.searchControl.setValue('');
            }

            if (this.currentOption) {
                this.highlightedOption = this.currentOption;
            }
        }
    }

    pickOption(pickedOption: IEsOption<T>): void {
        if (!this._onChange) {
            return;
        }

        let newValue;

        if (this.multiple) {
            this.currentOptions = this._filterOptions((option) => {
                return pickedOption === option || this.isSelected(option);
            });
            newValue = this.currentOptions?.map((o) => o.getValue());
            this.highlightedOption = undefined;
            if (this.searchControl.value) {
                this.searchControl.setValue('');
            }
        } else {
            this.isOpen = false;
            newValue = pickedOption.getValue();
            this.currentOption = pickedOption;
        }

        if (!isEqual(this.currentValue, newValue)) {
            this.currentValue = newValue;
            this._onChange(this.currentValue);
        }
        this.hasNextPage = false;
    }

    isSelected(option: IEsOption<T>): boolean {
        if (this.multiple) {
            return !!this.currentOptions?.includes(option);
        }
        return option === this.currentOption;
    }

    resolveOptions(page?: number): void {
        this.hasNextPage = false;
        const timeout = this.loading ? 750 : 0;
        if (this._lastResolve.timeout !== null) {
            clearTimeout(this._lastResolve.timeout);
            this._lastResolve.timeout = null;
            if (this._lastResolve.subscription !== null) {
                this._lastResolve.subscription.unsubscribe();
                this._lastResolve.subscription = null;
            }
        }

        if (
            typeof this.searchControl.value === 'string'
            && this.searchControl.value.length
            && this.searchControl.value.length >= (this.typeToSearch || 0)
        ) {
            this.loading = true;
            this._lastResolve.timeout = setTimeout(() => {
                this._lastResolve.timeout = null;
                if (typeof this.resolveOnSearch === 'function') {
                    this._lastResolve.subscription = this.resolveOnSearch(this.searchControl.value, page || 1)
                        .pipe(first())
                        .subscribe((result) => {
                            this.loading = false;
                            this._lastResolve.subscription = null;
                            this.hasNextPage = result.hasNextPage || false;
                            this.visibleOptions = result.visibleOptions || undefined;
                            this.page = page || 1;
                            setTimeout(() => {
                                this._updateOptionsVisibility();
                            });
                        })
                }
            }, timeout);
        } else if (this.visibleOptions) {
            this.visibleOptions.length = 0;
            this._updateOptionsVisibility();
        }
    }

    addOptionAction(): void {
        if (typeof this.addOption === 'function' && this.searchControl.value?.length) {
            let esOption: IEsOptionComponent<T> | undefined;

            this.optionGroups?.find((esOptionGroup) => {
                const option = esOptionGroup.optionComponents?.find((o) => {
                    return o.getLabel() === this.searchControl.value;
                });

                if (option) {
                    esOption = option;
                }
                return !!option;
            })

            if (esOption) {
                this.pickOption(esOption.option);
            } else {
                this.addOption(this.searchControl.value);
                if (!this.multiple) {
                    this.isOpen = false;
                }
            }
        }
    }

    deselect(deselectedOption?: IEsOption<T>): void {
        if (this.multiple) {
            if (Array.isArray(this.currentOptions)) {
                this.currentOptions = this.currentOptions.filter((option) => {
                    return deselectedOption !== option;
                });
                this.currentValue = this.currentOptions?.map((o) => o.getValue());
            }
        } else {
            this.currentOption = undefined;
            this.currentValue = this.deselectValue;
        }
        this.highlightedOption = undefined;
        if (this._onChange) {
            this._onChange(this.currentValue);
        }
    }

    private _updateOptionsVisibility(): void {
        const searchValue = typeof this.searchControl.value === 'string' ? this.searchControl.value : '';

        if (!this.optionGroups) {
            return;
        }

        let firstVisibleOption: IEsOption<T> | undefined;

        const filterGroup = (esOptionGroup: IEsOptionGroupComponent<T>): boolean => {
            // search in options
            let allOptionsHidden = true;

            if (searchValue.length >= this.typeToSearch && esOptionGroup.optionComponents) {
                esOptionGroup.optionComponents
                    .forEach((esOption) => {
                        if (this.resolveOnSearch) {
                            esOption.hidden = Array.isArray(this.visibleOptions)
                                && !this.visibleOptions.find((value) => isEqual(esOption.option.getValue(), value));
                        } else if (this.searchByValue) {
                            const value = esOption.option.getValue();
                            esOption.hidden = !(
                                (typeof value === 'string' && value.includes(searchValue))
                                || (
                                    typeof value === 'object'
                                    && value !== null
                                    && JSON.stringify(value).toLowerCase().includes(searchValue)
                                )
                            );
                        } else {
                            esOption.hidden = !esOption.getLabel().toLowerCase().includes(searchValue);
                        }

                        if (!esOption.hidden) {
                            allOptionsHidden = false;
                            if (!firstVisibleOption && !this.isSelected(esOption.option)) {
                                firstVisibleOption = esOption.option;
                            }
                        }
                    });
            }

            // search in nested option groups
            let allChildGroupsHidden = true;
            (this._optionGroupChildReferences.get(esOptionGroup) || [])
                .forEach((esOptionGroup) => {
                    if (!filterGroup(esOptionGroup)) {
                        allChildGroupsHidden = false;
                    }
                })
            return esOptionGroup.hidden = allOptionsHidden && allChildGroupsHidden;
        }

        // start with top-level groups
        this.optionGroups
            .filter((x) => x.esOptions.level === 0)
            .forEach(filterGroup);

        if (searchValue.length && firstVisibleOption) {
            this.highlightedOption = firstVisibleOption;
        } else {
            this.highlightedOption = undefined;
        }
    }

    private _updateCurrentOption(value: unknown): void {
        this.currentOption = undefined;
        this.currentOptions = undefined;

        if (!this.multiple) {
            this.currentOption = this._findOption((option) => isEqual(option.getValue(), value));
        } else if (Array.isArray(value)) {
            this.currentOptions = this._filterOptions((option) => {
                const optionValue = option.getValue();
                return !!value.find((item) => isEqual(optionValue, item));
            });
        }
    }

    private _findOption(
        findFn: (item: IEsOption<T>, idx: number, array: IEsOption<T>[]) => boolean,
    ): IEsOption<T> | undefined {
        let item: IEsOption<T> | undefined;
        this.esOptionsList?.some((esOptions) => {
            item = esOptions.options.value.find(findFn);
            return !!item;
        });
        return item;
    }

    private _filterOptions(
        filterFn: (item: IEsOption<T>, idx: number, array: IEsOption<T>[]) => boolean
    ): IEsOption<T>[] {
        let items: IEsOption<T>[] = [];
        this.esOptionsList?.forEach((esOptions) => {
            items = items.concat(esOptions.options.value.filter(filterFn));
        });
        return items;
    }
}
