/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!function(){
	'use strict';

	function extendedSelectSearchFilter($sce){
		return function(input, search){
			if(search.length){
				input = input.replace(new RegExp('(' + search + ')', 'gi'), '<u>$1</u>');
			}
			//noinspection JSUnresolvedFunction
			return $sce.trustAsHtml(input);
		};
	}

	/**
	 * @ngdoc filter
	 * @name extendedSelectSearch
	 * @description Underscore results in dropdown
	 */
	angular.module('extendedSelect').filter('extendedSelectSearch', extendedSelectSearchFilter);
}();
