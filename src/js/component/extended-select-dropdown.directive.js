/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!(function() {
    'use strict';

    /**
	 * @ngdoc directive
	 * @name extendedSelectDropdown
	 */
    function extendedSelectDropdown() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.on('click', function(e) {
                    e.stopPropagation(); // prevent dropdown from closing
                });
            }
        }
    }

    angular.module('extendedSelect').directive('extendedSelectDropdown', extendedSelectDropdown);
}());
