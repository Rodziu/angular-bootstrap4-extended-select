/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!(function() {
    'use strict';

    function extendedSelectFilter() {
        return function(options, search, typeToSearch, searchByValue) {
            if (angular.isUndefined(search)) {
                return options;
            }
            if (search.length < typeToSearch) {
                return [];
            }
            const ret = [];
            search = search.toLowerCase();
            for (let o = 0; o < options.length; o++) {
                if (
                    !!~options[o].label.toLowerCase().indexOf(search)
					|| (searchByValue && !!~options[o].value.toLowerCase().indexOf(search))
                ) {
                    ret.push(options[o]);
                }
            }
            return ret;
        };
    }

    /**
	 * @ngdoc filter
	 * @name extendedSelectFilter
	 * @description Filter visible options
	 */
    angular.module('extendedSelect').filter('extendedSelectFilter', extendedSelectFilter);

}());
