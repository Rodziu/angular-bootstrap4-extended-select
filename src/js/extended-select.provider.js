/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

!(function() {
    'use strict';

    function extendedSelectProvider() {
        this.options = {
            placeholder: '\u00A0',
            placeholderMultiple: '\u00A0',
            typeToSearch: 0,
            typeToSearchText: 'Zacznij pisać, by wyświetlić dostępne opcje',
            addOptionLang: 'Dodaj',
            loadMoreResultsLang: 'Pobierz więcej wyników',
            searchByValue: false
        };
        // noinspection JSUnusedGlobalSymbols
        this.$get = function() {
            return this.options;
        };
    }

    angular.module('extendedSelect').provider('extendedSelect', extendedSelectProvider);
}());
