/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

!function(){
	'use strict';

	function extendedSelectComponentController(
		$element, $attrs, $scope, $timeout, extendedSelectOptions, extendedSelect
	){
		const ctrl = this,
			transcludeElement = $element[0].querySelector('[ng-transclude]'),
			ngOptions = 'ngOptions' in $attrs
				? extendedSelectOptions.parseNgOptions($attrs['ngOptions']) : null,
			updateMultipleModel = function(newValue, removeValue){
				// sort selected options, so we get same result as in select element.
				const sorted = [];
				for(let i = 0; i < ctrl.options.length; i++){
					if(
						(
							ctrl.isSelected(ctrl.options[i])
							|| angular.equals(ctrl.options[i].value, newValue)
						)
						&& !angular.equals(ctrl.options[i].value, removeValue)
					){
						sorted.push(ctrl.options[i].value);
					}
				}
				if(!angular.equals(ctrl.ngModel, sorted)){
					ctrl.ngModel = sorted;
				}
			};
		/**
		 * @returns {*}
		 */
		ctrl.getModelValue = function(value){
			if(angular.isUndefined(value)){
				value = ctrl.ngModel;
			}
			for(let o = 0; o < ctrl.options.length; o++){
				if(angular.equals(ctrl.options[o].value, value)){
					return ctrl.options[o].label;
				}
			}
			return false;
		};
		let searchTimeout = null,
			lastSearchValue;
		/**
		 * Search change callback
		 */
		ctrl.searchFn = function(){
			ctrl.activeIndex = ctrl.options.length ? 0 : -1;
			if(angular.isFunction(ctrl.resolveOnSearch) && !ctrl.multiple){
				if(angular.isDefined(ctrl.search) && ctrl.search.length){
					const timeout = angular.isUndefined(lastSearchValue) ? 0 : 750;
					if(searchTimeout !== null){
						$timeout.cancel(searchTimeout);
					}
					lastSearchValue = ctrl.search;
					ctrl.loading = true;
					searchTimeout = $timeout(function(){
						searchTimeout = null;
						ctrl.resolveOnSearch({value: ctrl.search}).then(function(){
							lastSearchValue = undefined;
							ctrl.loading = false;
						}).catch(function(){
						});
					}, timeout);
				}
			}
		};
		/**
		 * @param option
		 */
		ctrl.pickOption = function(option){
			if(ctrl.multiple){
				if(angular.isUndefined(ctrl.ngModel)){
					ctrl.ngModel = [];
				}
				if(!~ctrl.ngModel.indexOf(option.value)){
					updateMultipleModel(option.value);
				}
				ctrl.activeIndex = -1;
				ctrl.search = '';
			}else{
				ctrl.isOpen = false;
				ctrl.ngModel = option.value;
				ctrl.activeIndex = ctrl.options.indexOf(option);
			}
		};
		/**
		 * @param option
		 * @returns {boolean}
		 */
		ctrl.isSelected = function(option){
			if(angular.isUndefined(ctrl.ngModel)){
				return false;
			}
			if(ctrl.multiple){
				return !!~ctrl.ngModel.indexOf(option.value);
			}
			return angular.equals(option.value, ctrl.ngModel);
		};
		/**
		 * @param value
		 */
		ctrl.deselect = function(value){
			if(ctrl.multiple){
				updateMultipleModel(undefined, value);
			}else{
				ctrl.ngModel = undefined;
			}
			ctrl.activeIndex = -1;
		};
		/**
		 */
		ctrl.addOptionAction = function(){
			if(angular.isFunction(ctrl.addOption) && ctrl.search.length){
				let found = false;
				for(let o = 0; o < ctrl.options.length; o++){
					if(ctrl.options[o].label === ctrl.search){
						ctrl.pickOption(ctrl.options[o]);
						found = true;
						break;
					}
				}
				if(!found){
					ctrl.addOption({value: ctrl.search});
					ctrl.addOptionCalled = true;
					// we set this flag, so we can update ngModel with proper option,
					// which will be generated on next digest cycle
				}
			}
		};
		/**
		 */
		$element.on('click', function(){
			const wasOpen = ctrl.isOpen;
			ctrl.ngModelCtrl.$setTouched();
			if($attrs.disabled){
				ctrl.isOpen = false;
			}else{
				ctrl.isOpen = ctrl.multiple ? true : !ctrl.isOpen;
			}
			if(!wasOpen && ctrl.isOpen){
				ctrl.search = '';
				// reset active index
				ctrl.activeIndex = -1;
				for(let i = 0; i < ctrl.options.length; i++){
					if(ctrl.isSelected(ctrl.options[i])){
						ctrl.activeIndex = i;
						if(!ctrl.multiple){
							break;
						}
					}
				}
			}
			$scope.$digest();
			if(!wasOpen && ctrl.isOpen){
				ctrl.searchElement[0].focus();
			}
		});
		/**
		 */
		$attrs.$observe('disabled', function(value){
			ctrl.isDisabled = value;
		});
		/**
		 */
		$attrs.$observe('placeholder', function(value){
			ctrl.placeholder = value;
		});
		/**
		 * Init
		 */
		ctrl.$onInit = function(){
      ctrl.options = [];
			ctrl.optionsFiltered = [];
			ctrl.activeIndex = -1;
			ctrl.search = '';
			ctrl.multiple = 'multiple' in $attrs;
			if (!ctrl.deselectable && 'deselectable' in $attrs && !$attrs.deselectable.length) {
				ctrl.deselectable = true;
      }
			ctrl.addOptionLang = extendedSelect.addOptionLang;
			if(angular.isUndefined(ctrl.typeToSearch)){
				ctrl.typeToSearch = extendedSelect.typeToSearch;
			}
			ctrl.typeToSearchText = extendedSelect.typeToSearchText;
			if(angular.isUndefined(ctrl.searchByValue)){
				ctrl.searchByValue = extendedSelect.searchByValue;
			}
			if(angular.isUndefined(ctrl.placeholder)){
				ctrl.placeholder = 'multiple' in $attrs
					? extendedSelect.placeholderMultiple : extendedSelect.placeholder
			}
			if($element.hasClass('custom-select-sm')){
				$element.children().addClass('custom-select-sm');
				$element.removeClass('custom-select-sm');
			}
			if(ctrl.multiple){
				/**
				 * @var ngModelCtrl
				 * @type {{}}
				 */
				ctrl.ngModelCtrl.$isEmpty = function(value){
					return !value || value.length === 0;
				};
			}
		};
		/**
		 * Check
		 */
		ctrl.$doCheck = function(){
			const optionElements = transcludeElement.querySelectorAll('option'),
				options = [];
			let pickLater;
			for(let i = 0; i < optionElements.length; i++){
				// noinspection JSCheckFunctionSignatures
				const option = angular.element(optionElements[i]);
				options.push({
					value: option.val(),
					label: option.text().trim()
				});
			}
			if(ngOptions !== null){
				const optionObjects = ngOptions.valuesFn($scope.$parent);
				for(let i = 0; i < optionObjects.length; i++){
					const locals = ngOptions.getLocals(i, optionObjects[i]);
					options.push({
						value: ngOptions.valueFn($scope.$parent, locals),
						label: ngOptions.displayFn($scope.$parent, locals)
					});
					if(ctrl.addOptionCalled && options[options.length - 1].label === ctrl.search){
						pickLater = options[options.length - 1];
						ctrl.addOptionCalled = false;
					}
				}
			}
			if(!angular.equals(options, ctrl.options)){
				ctrl.options = options;
				if(angular.isDefined(pickLater)){
					// in multiple mode, we need to wait until new option is added to ctrl.options
					// before selecting it
					ctrl.pickOption(pickLater);
				}
			}
			ctrl.isSmall = $element.hasClass('custom-select-sm');
			ctrl.isLarge = $element.hasClass('custom-select-lg');
		};
	}

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
	angular.module('extendedSelect').component('extendedSelect', {
		require: {
			ngModelCtrl: 'ngModel'
		},
		bindings: {
			ngModel: '=',
			addOption: '&?',
			resolveOnSearch: '&?',
			deselectable: '<?',
			typeToSearch: '<?',
			searchByValue: '<?'
		},
		transclude: true,
		templateUrl: ['$attrs', function($attrs){
			if('multiple' in $attrs){
				return "src/templates/extended-select-multiple.html";
			}
			return "src/templates/extended-select.html";
		}],
		controllerAs: 'ctrl',
		controller: extendedSelectComponentController
	});

}();
