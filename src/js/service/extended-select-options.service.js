/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!function(){
	'use strict';
	/**
	 * Parse ng-options in angular way.
	 * 1: value expression (valueFn)
	 * 2: label expression (displayFn)
	 * 3: group by expression (groupByFn)
	 * 4: disable when expression (disableWhenFn)
	 * 5: array item variable name
	 * 6: object item key variable name
	 * 7: object item value variable name
	 * 8: collection expression
	 * 9: track by expression
	 * @type {RegExp}
	 */
	const NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([$\w][$\w]*)|(?:\(\s*([$\w][$\w]*)\s*,\s*([$\w][$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;

	/**
	 * @ngdoc factory
	 * @name ExtendedSelectOptions
	 * @description extended-select helper functions
	 */
	function extendedSelectOption($parse){
		return {
			parseNgOptions
		};

		function parseNgOptions(ngOptionsString){
			const match = ngOptionsString.match(NG_OPTIONS_REGEXP);
			if(match == null){
				return null;
			}
			const valueName = match[5] || match[7],
				keyName = match[6];
			return {
				valueFn: $parse(match[2] ? match[1] : valueName),
				displayFn: $parse(match[2] || match[1]),
				valuesFn: $parse(match[8]),
				getLocals: function(k, v){
					const locals = {};
					locals[valueName] = v;
					if(keyName){
						locals[keyName] = k;
					}
					return locals;
				}
			};
		}
	}

	angular.module('extendedSelect').factory('extendedSelectOptions', extendedSelectOption);
}();
