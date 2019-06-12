/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

angular.module('extendedSelect', ['angularBS.helpers', 'angularBS.dropdown']);

/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!function(){
	'use strict';

	/**
	 * Prevent ng-options directive from compiling on angular-extended-select
	 */
	extendedSelectConfig.$inject = ["$provide"];
	function extendedSelectConfig($provide){
		const blocked = ['ngOptions', 'select'];
		angular.forEach(blocked, function(d){
			$provide.decorator(d + 'Directive', ['$delegate', function($delegate){
				angular.forEach($delegate, function(directive){
					const compile_ = directive.compile || function(){
					};
					directive.compile = function(element){
						if(element[0].tagName === 'EXTENDED-SELECT'){
							return;
						}
						return compile_.apply(this, arguments) || directive.link;
					};
				});
				return $delegate;
			}]);
		});
	}

	angular.module('extendedSelect').config(extendedSelectConfig);
}();

/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

!function(){
	'use strict';

	function extendedSelectProvider(){
		this.options = {
			placeholder: '\u00A0',
			placeholderMultiple: '\u00A0',
			typeToSearch: 0,
			typeToSearchText: 'Zacznij pisać, by wyświetlić dostępne opcje',
			addOptionLang: 'Dodaj',
			searchByValue: false
		};
		// noinspection JSUnusedGlobalSymbols
		this.$get = function(){
			return this.options;
		};
	}

	angular.module('extendedSelect').provider("extendedSelect", extendedSelectProvider);
}();

/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!function(){
	'use strict';

	/**
	 * @ngdoc directive
	 * @name extendedSelectDropdown
	 */
	function extendedSelectDropdown(){
		return {
			restrict: 'A',
			link: function(scope, element){
				element.on('click', function(e){
					e.stopPropagation(); // prevent dropdown from closing
				});
			}
		}
	}

	angular.module('extendedSelect').directive('extendedSelectDropdown', extendedSelectDropdown);
}();

/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!function(){
	'use strict';

	/**
	 * @ngdoc directive
	 * @name extendedSelectOptions
	 * @description automatically scroll dropdown window to highlighted option
	 */
	function extendedSelectOptionsDirective(){
		return {
			restrict: 'A',
			bindToController: {
				activeIndex: '<extendedSelectOptions'
			},
			controller: ['$element', 'angularBS', function($element, angularBS){
				const ctrl = this;
				ctrl.$onChanges = function(){ // it's always an activeIndex change
					const li = $element[0].querySelector(`li:nth-child(${ctrl.activeIndex + 1})`);
					if(li === null){
						return;
					}
					const top = li.offsetTop,
						scroll = $element[0].scrollTop,
						bot = angularBS.offset(li).height + top,
						ulHeight = angularBS.offset($element[0]).height;
					if(scroll - top > 0){ // move it up
						$element[0].scrollTop = top;
					}else if(scroll - bot < ulHeight * -1){ // move it down
						$element[0].scrollTop = bot - ulHeight;
					}
				};
			}]
		};
	}

	angular.module('extendedSelect').directive('extendedSelectOptions', extendedSelectOptionsDirective);
}();

/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!function(){
	'use strict';

	/**
	 * @ngdoc directive
	 * @name extendedSelectSearch
	 * @description search element
	 */
	function extendedSelectSearchDirective(){
		return {
			restrict: 'A',
			require: '^extendedSelect',
			link: function(scope, element, attrs, ctrl){
				ctrl.searchElement = element;
				/**
				 * move selection or pick an option on keydown
				 */
				element.on('keydown', function(e){
					if(!ctrl.optionsFiltered.length){
						if(e.which === 13){
							ctrl.addOptionAction();
							scope.$apply();
						}
						return;
					}
					const originalIndex = ctrl.activeIndex;
					switch(e.which){
						case 40: // down
							do{
								ctrl.activeIndex++;
								if(ctrl.activeIndex >= ctrl.optionsFiltered.length){
									ctrl.activeIndex = originalIndex;
									break;
								}
							}while(ctrl.multiple && ctrl.isSelected(ctrl.optionsFiltered[ctrl.activeIndex]));
							break;
						case 38: // up
							do{
								ctrl.activeIndex--;
								if(ctrl.activeIndex < 0){
									ctrl.activeIndex = originalIndex;
									break;
								}
							}while(ctrl.multiple && ctrl.isSelected(ctrl.optionsFiltered[ctrl.activeIndex]));
							break;
						case 13: // enter
							if(angular.isDefined(ctrl.optionsFiltered[ctrl.activeIndex])){
								ctrl.pickOption(ctrl.optionsFiltered[ctrl.activeIndex]);
								scope.$apply();
								return;
							}
							break;
					}
					scope.$digest();
				});
			}
		};
	}

	angular.module('extendedSelect').directive('extendedSelectSearch', extendedSelectSearchDirective);
}();

/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

!function(){
	'use strict';

	extendedSelectComponentController.$inject = ["$element", "$attrs", "$scope", "$timeout", "extendedSelectOptions", "extendedSelect"];
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
						ctrl.resolveOnSearch(ctrl.search).then(function(){
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
					ctrl.addOption(ctrl.search);
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
			ctrl.deselectable = 'deselectable' in $attrs;
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
						value: ngOptions.valueFn(locals),
						label: ngOptions.displayFn(locals)
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
	 * @param {string} deselectable
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
			addOption: '<?',
			resolveOnSearch: '<?',
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

/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!function(){
	'use strict';

	function extendedSelectFilter(){
		return function(options, search, typeToSearch, searchByValue){
			if(angular.isUndefined(search)){
				return options;
			}
			if(search.length < typeToSearch){
				return [];
			}
			const ret = [];
			search = search.toLowerCase();
			for(let o = 0; o < options.length; o++){
				if(
					!!~options[o].label.toLowerCase().indexOf(search)
					|| (searchByValue && !!~options[o].value.toLowerCase().indexOf(search))
				){
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

}();

/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!function(){
	'use strict';

	extendedSelectSearchFilter.$inject = ["$sce"];
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
	extendedSelectOption.$inject = ["$parse"];
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

angular.module('extendedSelect').run(['$templateCache', function($templateCache) {$templateCache.put('src/templates/extended-select-multiple.html','<div class="dropdown custom-select angular-extended-select" bs-dropdown="ctrl.isOpen" ng-class="{\'custom-select-sm\': ctrl.isSmall, \'custom-select-lg\': ctrl.isLarge}" ng-disabled="ctrl.isDisabled"><span class="caret"></span><ul class="extended-select-multiple"><li ng-show="!ctrl.ngModel.length && !ctrl.isOpen">{{ctrl.placeholder}}</li><li ng-repeat="m in ctrl.ngModel" class="ext-select-choice" ng-if="ctrl.getModelValue(m)"><span>{{::ctrl.getModelValue(m)}}</span> <button type="button" class="close" ng-click="$event.stopPropagation();ctrl.deselect(m)" ng-if="!ctrl.isDisabled">&times;</button></li><li ng-show="ctrl.isOpen"><input type="text" ng-model="ctrl.search" extended-select-search ng-change="ctrl.searchFn()" ng-disabled="attr.disabled"> <a ng-click="$event.stopPropagation();ctrl.addOptionAction()" class="label label-success" ng-show="ctrl.addOption && ctrl.search">{{::ctrl.addOptionLang}}</a></li></ul><div class="clearfix"></div><div class="dropdown-menu" extended-select-dropdown><ul class="dropdown-menu" extended-select-options="ctrl.activeIndex"><li class="dropdown-item" ng-repeat="o in ctrl.optionsFiltered = (ctrl.options | extendedSelectFilter:ctrl.search:ctrl.typeToSearch:ctrl.searchByValue)" ng-click="ctrl.pickOption(o)" ng-class="{\'active\': $index == ctrl.activeIndex, \'selected\': ctrl.isSelected(o)}"><a ng-bind-html="o.label | extendedSelectSearch:ctrl.search"></a></li><li class="dropdown-item" ng-show="ctrl.typeToSearch && ctrl.search == \'\'"><a>{{::ctrl.typeToSearchText}}</a></li></ul></div><div ng-transclude style="display:none"></div></div>');
$templateCache.put('src/templates/extended-select.html','<div class="dropdown custom-select angular-extended-select" bs-dropdown="ctrl.isOpen" ng-class="{\'custom-select-sm\': ctrl.isSmall, \'custom-select-lg\': ctrl.isLarge}" ng-disabled="ctrl.isDisabled"><span class="caret"></span> <a class="deselect" ng-if="ctrl.deselectable && ctrl.getModelValue() && !ctrl.isDisabled" ng-click="ctrl.deselect()">&times;</a> {{ctrl.getModelValue() || ctrl.placeholder}}<div class="clearfix"></div><div class="dropdown-menu" extended-select-dropdown><div ng-class="{\'input-group input-group-sm\': ctrl.addOption}"><input type="text" class="form-control form-control-sm" ng-model="ctrl.search" ng-change="ctrl.searchFn()" extended-select-search> <span ng-show="ctrl.loading"><i class="fa fa-spinner fa-spin ext-select-loading"></i></span> <span class="input-group-append" ng-if="ctrl.addOption"><button type="button" class="btn btn-success" ng-click="$event.stopPropagation();ctrl.addOptionAction()">{{::ctrl.addOptionLang}}</button></span></div><ul class="dropdown-menu" extended-select-options="ctrl.activeIndex"><li class="dropdown-item" ng-repeat="o in ctrl.optionsFiltered = (ctrl.options | extendedSelectFilter:ctrl.search:ctrl.typeToSearch:ctrl.searchByValue)" ng-click="ctrl.pickOption(o)" ng-class="{\'active\': $index == ctrl.activeIndex}"><a ng-bind-html="o.label | extendedSelectSearch:ctrl.search"></a></li><li class="dropdown-item" ng-show="ctrl.typeToSearch && ctrl.search == \'\'"><a>{{::ctrl.typeToSearchText}}</a></li></ul></div><div ng-transclude style="display:none"></div></div>');}]);