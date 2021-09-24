/*
 * Angular Extended Select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import {EsBeforeOptionDirective} from '../es-before-option.directive';
import {BehaviorSubject, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {EsOptionsDirective, IEsOption} from '../es-options.directive';
import {QueryList} from '@angular/core';
import {IEsOptionGroupComponent} from '../es-option-group/es-option-group-component.interface';

export interface IResolveOnSearchResult<T = unknown> {
    hasNextPage?: boolean,
    visibleOptions?: T[]
}

export interface IExtendedSelectComponent<T = unknown> {
    multiple: boolean;
    typeToSearch: number;
    searchByValue: boolean;
    placeholder?: string;
    resolveOnSearch?: (value: string, page: number) => Observable<IResolveOnSearchResult>;
    addOption?: (value: string) => void;
    deselectable: boolean;
    deselectValue?: unknown;
    size?: 'sm' | 'lg';
    esOptionsList?: QueryList<EsOptionsDirective<T>>;
    esBeforeOption?: EsBeforeOptionDirective<T>;
    optionGroups?: QueryList<IEsOptionGroupComponent<T>>;
    isOpen$: BehaviorSubject<boolean>;
    isOpen: boolean;
    isDisabled: boolean;
    currentValue?: unknown;
    currentOption?: IEsOption<T>;
    currentOptions?: IEsOption<T>[];
    loading: boolean;
    searchControl: FormControl;
    page$: BehaviorSubject<number>;
    page: number;
    highlightedOption$: BehaviorSubject<IEsOption<T> | undefined>;
    highlightedOption: IEsOption<T> | undefined;
    getVisibleOptions(): IEsOption<T>[];
    open(): void;
    pickOption(pickedOption: IEsOption<T>): void;
    isSelected(option: IEsOption<T>): boolean;
    resolveOptions(page?: number): void;
    addOptionAction(): void;
    deselect(deselectedOption?: IEsOption<T>): void;
}
