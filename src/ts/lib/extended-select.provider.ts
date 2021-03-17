/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

export interface IExtendedSelectOptions {
    placeholder: string,
    placeholderMultiple: string,
    typeToSearch: number,
    typeToSearchText: string,
    addOptionLang: string,
    loadMoreResultsLang: string,
    searchByValue: boolean
}

export class ExtendedSelectProvider {
    options: IExtendedSelectOptions = {
        placeholder: '\u00A0',
        placeholderMultiple: '\u00A0',
        typeToSearch: 0,
        typeToSearchText: 'Begin typing to display available options',
        addOptionLang: 'Add',
        loadMoreResultsLang: 'Load more results',
        searchByValue: false
    }

    $get(): IExtendedSelectOptions {
        return this.options;
    }
}
