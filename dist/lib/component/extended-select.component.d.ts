import { IAttributes, IComponentOptions, INgModelController, IPromise, IScope, ITimeoutService, ITranscludeFunction } from 'angular';
import { ExtendedSelectOptionsService } from '../service/extended-select-options.service';
import { IExtendedSelectOptions } from '../extended-select.provider';
export interface IGroupItem {
    name: string;
    parentGroup: string;
    children: IGroupItem[];
    level?: number;
    parent?: IGroupItem;
}
export interface IExtendedSelectOption {
    value: unknown;
    label: string;
    group?: IGroupItem;
}
/**
 * @ngInject
 */
export declare class ExtendedSelectComponentController {
    private $element;
    private $attrs;
    private $scope;
    private $timeout;
    private $transclude;
    private extendedSelectOptions;
    private extendedSelect;
    ngModel: unknown | unknown[];
    addOption: (locals: {
        value: string;
    }) => void;
    resolveOnSearch: (locals: {
        value: string;
        page: number;
    }) => IPromise<{
        hasNextPage?: boolean;
    }>;
    deselectable: boolean;
    deselectValue: unknown;
    typeToSearch: number;
    searchByValue: boolean;
    ngModelCtrl: INgModelController;
    options: IExtendedSelectOption[];
    optionsFiltered: IExtendedSelectOption[];
    activeIndex: number;
    search: string;
    multiple: boolean;
    addOptionLang: string;
    loadMoreResultsLang: string;
    typeToSearchText: string;
    placeholder: string;
    isDisabled: boolean;
    isReadonly: boolean;
    isSmall: boolean;
    isLarge: boolean;
    isOpen: boolean;
    hasNextPage: boolean;
    page: number;
    loading: boolean;
    private _ngOptions;
    private _searchTimeout;
    private _optionObjects;
    private _addOptionCalled;
    private _lastSearchValue;
    private _transcludedOptions;
    constructor($element: JQLite, $attrs: IAttributes, $scope: IScope, $timeout: ITimeoutService, $transclude: ITranscludeFunction, extendedSelectOptions: ExtendedSelectOptionsService, extendedSelect: IExtendedSelectOptions);
    $onInit(): void;
    $doCheck(): void;
    updateOptions(optionObjects: Record<string, unknown>[]): void;
    open(): void;
    _updateMultipleModel(newValue: unknown, removeValue?: unknown): void;
    filterData(): void;
    isSelected(option: IExtendedSelectOption): boolean;
    getModelLabel(value?: unknown): string;
    searchFn(page?: number): void;
    pickOption(option: IExtendedSelectOption): void;
    deselect(value: unknown): void;
    addOptionAction(): void;
}
/**
 * @ngdoc component
 * @name beforeOption
 */
/**
 * @ngdoc component
 * @name optionTemplate
 */
/**
 * @ngdoc component
 * @name extendedSelect
 *
 * @param {expression} ngModel
 * @param {expression|function} addOption
 * @param {expression|function} resolveOnSearch
 * @param {expression} deselectable
 * @param {expression|number} typeToSearch
 * @param {expression|boolean} searchByValue
 * @param {String} placeholder
 * @parma {String} multiple
 */
export declare const extendedSelectComponent: IComponentOptions;
