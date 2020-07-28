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
!(function() {
    'use strict';

    /**
	 * Prevent ng-options directive from compiling on angular-extended-select
	 */
    extendedSelectConfig.$inject = ["$provide"];
    function extendedSelectConfig($provide) {
        const blocked = ['ngOptions', 'select'];
        angular.forEach(blocked, function(d) {
            $provide.decorator(d + 'Directive', ['$delegate', function($delegate) {
                angular.forEach($delegate, function(directive) {
                    const compile_ = directive.compile || function() {
                    };
                    directive.compile = function(element) {
                        if (element[0].tagName === 'EXTENDED-SELECT') {
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
}());

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

/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name esTransclude
     */
    function esTranscludeDirective() {
        return {
            restrict: 'A',
            require: '^extendedSelect',
            link: function(scope, element, attrs, ctrl, transclude) {
                const slots = attrs['esTransclude'] ? [attrs['esTransclude']] : ['optionTemplate', 'beforeOption'];
                slots.forEach((slot) => {
                    if (transclude.isSlotFilled(slot)) {
                        transclude((clone, transcludedScope) => {
                            transcludedScope.$extendedSelect = ctrl;
                            transcludedScope.$option = scope['o'];
                            transcludedScope.$isOption = true;
                            if (angular.isUndefined(scope['o'])) {
                                transcludedScope.$isOption = false;
                                if (ctrl.multiple) {
                                    transcludedScope.$option = {
                                        value: scope['m'],
                                        label: ctrl.getModelLabel(scope['m'])
                                    };
                                } else {
                                    transcludedScope.$watch(() => {
                                        return ctrl.ngModel;
                                    }, () => {
                                        transcludedScope.$option = {
                                            value: ctrl.ngModel,
                                            label: ctrl.getModelLabel()
                                        };
                                    });
                                }
                            }
                            if (slot === 'optionTemplate') {
                                element.contents().replaceWith(clone);
                            } else {
                                element.prepend(clone);
                            }
                        }, null, slot);
                    }
                });
            }
        }
    }

    angular.module('extendedSelect').directive('esTransclude', esTranscludeDirective);
}());

/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2020 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!(function() {
    'use strict';

    extendedSelectMarkResultController.$inject = ["$element"];
    function extendedSelectMarkResultController($element) {
        const ctrl = this;
        ctrl.$doCheck = function() {
            if (ctrl.extendedSelect.search !== ctrl._search) {
                _update();
            }
        };

        ctrl.$onChanges = function() {
            _update();
        };

        //////

        function _update() {
            ctrl._search = ctrl.extendedSelect.search;
            let html = ctrl.label;
            if (angular.isString(ctrl._search) && ctrl._search.length) {
                html = ctrl.label.replace(new RegExp('(' + ctrl._search + ')', 'gi'), '<u>$1</u>')
            }
            $element.html(html);
        }
    }

    angular.module('extendedSelect').component('extendedSelectMarkResult', {
        require: {
            extendedSelect: '^extendedSelect'
        },
        bindings: {
            label: '<'
        },
        controllerAs: 'vm',
        controller: extendedSelectMarkResultController
    })
}());

/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name extendedSelectOptions
     * @description automatically scroll dropdown window to highlighted option
     */
    function extendedSelectOptionsDirective() {
        return {
            restrict: 'A',
            bindToController: {
                activeIndex: '<extendedSelectOptions'
            },
            controller: ['$element', 'angularBS', function($element, angularBS) {
                const ctrl = this;
                ctrl.$onChanges = function() { // it's always an activeIndex change
                    const item = $element[0].querySelector(
                        `.dropdown-item:nth-child(${ctrl.activeIndex + 1})`
                    );
                    if (item === null) {
                        return;
                    }
                    const top = item.offsetTop,
                        scroll = $element[0].scrollTop,
                        bot = angularBS.offset(item).height + top,
                        ulHeight = angularBS.offset($element[0]).height;
                    if (scroll - top > 0) { // move it up
                        $element[0].scrollTop = top;
                    } else if (scroll - bot < ulHeight * -1) { // move it down
                        $element[0].scrollTop = bot - ulHeight;
                    }
                };
            }]
        };
    }

    angular.module('extendedSelect').directive('extendedSelectOptions', extendedSelectOptionsDirective);
}());

/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!(function() {
    'use strict';

    /**
	 * @ngdoc directive
	 * @name extendedSelectSearch
	 * @description search element
	 */
    extendedSelectSearchDirective.$inject = ["$injector"];
    function extendedSelectSearchDirective($injector) {
        return {
            restrict: 'A',
            require: '^extendedSelect',
            link: function(scope, element, attrs, ctrl) {
                if ($injector.has('$animate')) {
                    $injector.get('$animate').enabled(element, false);
                }
                element[0].focus();
                /**
				 * move selection or pick an option on keydown
				 */
                element.on('keydown', function(e) {
                    e.stopPropagation();
                    if (!ctrl.optionsFiltered.length) {
                        if (e.which === 13) {
                            ctrl.addOptionAction();
                            ctrl.$scope.$apply();
                        }
                        return;
                    }
                    const originalIndex = ctrl.activeIndex;
                    switch (e.which) {
                        case 40: // down
                            do {
                                ctrl.activeIndex++;
                                if (ctrl.activeIndex >= ctrl.optionsFiltered.length) {
                                    ctrl.activeIndex = originalIndex;
                                    break;
                                }
                            } while (ctrl.multiple && ctrl.isSelected(ctrl.optionsFiltered[ctrl.activeIndex]));
                            break;
                        case 38: // up
                            do {
                                ctrl.activeIndex--;
                                if (ctrl.activeIndex < 0) {
                                    ctrl.activeIndex = originalIndex;
                                    break;
                                }
                            } while (ctrl.multiple && ctrl.isSelected(ctrl.optionsFiltered[ctrl.activeIndex]));
                            break;
                        case 13: // enter
                            if (angular.isDefined(ctrl.optionsFiltered[ctrl.activeIndex])) {
                                ctrl.pickOption(ctrl.optionsFiltered[ctrl.activeIndex]);
                                ctrl.$scope.$apply();
                                return;
                            }
                            break;
                    }
                    ctrl.$scope.$digest();
                });
            }
        };
    }

    angular.module('extendedSelect').directive('extendedSelectSearch', extendedSelectSearchDirective);
}());

/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

!(function() {
    'use strict';

    /**
     * @ngInject
     */
    class ExtendedSelectComponentController {
        constructor($element, $attrs, $scope, $timeout, $transclude, extendedSelectOptions, extendedSelect) {
            this.$element = $element;
            this.$attrs = $attrs;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.$transclude = $transclude;
            this.extendedSelectOptions = extendedSelectOptions;
            this.extendedSelect = extendedSelect;
            //
            this._ngOptions = 'ngOptions' in $attrs
                ? extendedSelectOptions.parseNgOptions($attrs['ngOptions']) : null;
            this._searchTimeout = null;
        }

        $onInit() {
            this.options = [];
            this.optionsFiltered = [];
            this.activeIndex = -1;
            this.search = '';
            this.multiple = 'multiple' in this.$attrs;
            if (!this.deselectable && 'deselectable' in this.$attrs && !this.$attrs.deselectable.length) {
                this.deselectable = true;
            }

            this.addOptionLang = this.extendedSelect.addOptionLang;
            this.loadMoreResultsLang = this.extendedSelect.loadMoreResultsLang;
            this.typeToSearchText = this.extendedSelect.typeToSearchText;

            if (angular.isUndefined(this.typeToSearch)) {
                this.typeToSearch = this.extendedSelect.typeToSearch;
            }
            if (angular.isUndefined(this.searchByValue)) {
                this.searchByValue = this.extendedSelect.searchByValue;
            }
            if (angular.isUndefined(this.placeholder)) {
                this.placeholder = 'multiple' in this.$attrs
                    ? this.extendedSelect.placeholderMultiple : this.extendedSelect.placeholder
            }
            if (this.multiple) {
                this.ngModelCtrl.$isEmpty = function(value) {
                    return !value || value.length === 0;
                };
            }
            //
            this.$attrs.$observe('placeholder', (value) => {
                this.placeholder = value;
            });
            this.$attrs.$observe('disabled', (value) => {
                this.isDisabled = value === true || angular.isString(value);
            });
            this.$attrs.$observe('readonly', (value) => {
                this.isReadonly = value === true || angular.isString(value);
            });
        }

        $doCheck() {
            const options = [];
            let pickLater;
            this.$transclude((clone) => {
                angular.forEach(clone, (optionElement) => {
                    options.push({
                        value: optionElement.value,
                        label: optionElement.textContent
                    })
                })
            }, null, 'option');
            if (this._ngOptions !== null) {
                const optionObjects = this._ngOptions.valuesFn(this.$scope.$parent);
                optionObjects.forEach((optionObject, key) => {
                    const locals = this._ngOptions.getLocals(key, optionObject);
                    options.push({
                        value: this._ngOptions.valueFn(this.$scope.$parent, locals),
                        label: this._ngOptions.displayFn(this.$scope.$parent, locals)
                    });
                    if (this._addOptionCalled && options[options.length - 1].label === this.search) {
                        pickLater = options[options.length - 1];
                        this._addOptionCalled = false;
                    }
                });
            }
            if (!angular.equals(options, this.options)) {
                this.options = options;
                if (pickLater) {
                    // in multiple mode, we need to wait until new option is added to this.options
                    // before selecting it
                    this.pickOption(pickLater);
                }
                this.filterData();
            }
            this.isSmall = this.$element.hasClass('custom-select-sm');
            this.isLarge = this.$element.hasClass('custom-select-lg');
        }

        open() {
            const wasOpen = this.isOpen;
            this.ngModelCtrl.$setTouched();
            if (this.isDisabled || this.isReadonly) {
                this.isOpen = false;
            } else {
                this.isOpen = this.multiple ? true : !this.isOpen;
            }
            if (!wasOpen && this.isOpen) {
                this.search = '';
                // reset active index
                this.activeIndex = -1;
                this.options.some((option, i) => {
                    if (this.isSelected(option)) {
                        this.activeIndex = i;
                        if (!this.multiple) {
                            return true; // break;
                        }
                    }
                });
                this.filterData();
            }
        }

        _updateMultipleModel(newValue, removeValue) {
            // sort selected options, so we get same result as in select element.
            const sorted = [];
            this.options.forEach((option) => {
                if (
                    (
                        this.isSelected(option)
                        || angular.equals(option.value, newValue)
                    )
                    && !angular.equals(option.value, removeValue)
                ) {
                    sorted.push(option.value);
                }
            });
            if (!angular.equals(this.ngModel, sorted)) {
                this.ngModel = sorted;
            }
        }

        filterData() {
            if (angular.isUndefined(this.search)) {
                angular.copy(this.options, this.optionsFiltered);
                return;
            }
            angular.copy([], this.optionsFiltered);
            if (this.search.length < this.typeToSearch) {
                return;
            }
            const search = this.search.toLowerCase();
            this.options.forEach((option) => {
                if (
                    !!~option.label.toLowerCase().indexOf(search)
                    || (this.searchByValue && !!~option.value.toLowerCase().indexOf(search))
                ) {
                    this.optionsFiltered.push(option);
                }
            });
        }

        isSelected(option) {
            if (angular.isUndefined(this.ngModel)) {
                return false;
            }
            if (this.multiple) {
                return !!~this.ngModel.indexOf(option.value);
            }
            return angular.equals(option.value, this.ngModel);
        }

        getModelLabel(value) {
            if (angular.isUndefined(value)) {
                value = this.ngModel;
            }
            const option = this.options.find((option) => {
                return angular.equals(option.value, value);
            });
            return option ? option.label : '';
        }

        searchFn(page) {
            if (angular.isUndefined(page)) {
                this.activeIndex = this.options.length ? 0 : -1;
            }
            this.hasNextPage = false;
            this.filterData();
            if (angular.isFunction(this.resolveOnSearch)) {
                this.page = page || 1;
                if (angular.isDefined(this.search) && this.search.length) {
                    const timeout = angular.isUndefined(this._lastSearchValue) ? 0 : 750;
                    if (this._searchTimeout !== null) {
                        this.$timeout.cancel(this._searchTimeout);
                    }
                    this._lastSearchValue = this.search;
                    this.loading = true;
                    this._searchTimeout = this.$timeout(() => {
                        this._searchTimeout = null;
                        this.resolveOnSearch({value: this.search, page: this.page}).then((response) => {
                            this._lastSearchValue = undefined;
                            this.loading = false;
                            this.hasNextPage = response && !!response.hasNextPage;
                            this.filterData();
                        }).catch(angular.noop);
                    }, timeout);
                }
            }
        }

        pickOption(option) {
            if (this.multiple) {
                if (angular.isUndefined(this.ngModel)) {
                    this.ngModel = [];
                }
                if (!~this.ngModel.indexOf(option.value)) {
                    this._updateMultipleModel(option.value);
                }
                this.activeIndex = -1;
                this.search = '';
            } else {
                this.isOpen = false;
                this.ngModel = option.value;
                this.activeIndex = this.options.indexOf(option);
            }
            this.hasNextPage = false;
            this.ngModelCtrl.$setViewValue(this.ngModel);
        }

        deselect(value) {
            if (this.multiple) {
                this._updateMultipleModel(undefined, value);
            } else {
                this.ngModel = undefined;
            }
            this.activeIndex = -1;
            this.ngModelCtrl.$setViewValue(this.ngModel);
        }

        addOptionAction() {
            if (angular.isFunction(this.addOption) && this.search.length) {
                const option = this.options.find((option) => {
                    return option.label === this.search;
                });
                if (option) {
                    this.pickOption(option);
                } else {
                    this.addOption({value: this.search});
                    this._addOptionCalled = true;
                    // we set this flag, so we can update ngModel with proper option,
                    // which will be generated on next digest cycle
                }
            }
        }
    }
    ExtendedSelectComponentController.$inject = ["$element", "$attrs", "$scope", "$timeout", "$transclude", "extendedSelectOptions", "extendedSelect"];

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
        transclude: {
            option: '?option',
            beforeOption: '?beforeOption',
            optionTemplate: '?optionTemplate'
        },
        templateUrl: 'src/templates/extended-select.html',
        controllerAs: 'ctrl',
        controller: ExtendedSelectComponentController
    });

}());

/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
!(function() {
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
    // eslint-disable-next-line max-len
    extendedSelectOption.$inject = ["$parse"];
    const NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([$\w][$\w]*)|(?:\(\s*([$\w][$\w]*)\s*,\s*([$\w][$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;

    /**
     * @ngdoc factory
     * @name ExtendedSelectOptions
     * @description extended-select helper functions
     */
    function extendedSelectOption($parse) {
        return {
            parseNgOptions
        };

        function parseNgOptions(ngOptionsString) {
            const match = ngOptionsString.match(NG_OPTIONS_REGEXP);
            if (match === null) {
                return null;
            }
            const valueName = match[5] || match[7],
                keyName = match[6];
            return {
                valueFn: $parse(match[2] ? match[1] : valueName),
                displayFn: $parse(match[2] || match[1]),
                valuesFn: $parse(match[8]),
                getLocals: function(k, v) {
                    const locals = {};
                    locals[valueName] = v;
                    if (keyName) {
                        locals[keyName] = k;
                    }
                    return locals;
                }
            };
        }
    }

    angular.module('extendedSelect').factory('extendedSelectOptions', extendedSelectOption);
}());

angular.module('extendedSelect').run(['$templateCache', function($templateCache) {$templateCache.put('src/templates/extended-select.html','<div class="dropdown custom-select angular-extended-select" bs-dropdown="ctrl.isOpen" ng-click="ctrl.open()" ng-class="{\'custom-select-sm\': ctrl.isSmall, \'custom-select-lg\': ctrl.isLarge}" ng-disabled="ctrl.isDisabled" ng-readonly="ctrl.isReadonly"><div class="d-flex flex-row-reverse align-items-center" ng-if="::!ctrl.multiple"><div class="d-flex"><div ng-show="ctrl.loading" class="flex-fill pl-1"><i class="fa fa-spinner fa-spin"></i></div><a class="text-success flex-fill pl-1" ng-click="$event.stopPropagation();ctrl.addOptionAction()" ng-if="ctrl.addOption && ctrl.search" title="{{::ctrl.addOptionLang}}"><i class="fa fa-plus"></i></a> <a class="text-danger flex-fill pl-1" ng-click="ctrl.deselect()" ng-if="ctrl.deselectable && ctrl.getModelLabel() && !ctrl.isDisabled && !ctrl.isReadonly"><i class="fa fa-times"></i></a></div><div class="d-flex flex-grow-1 align-items-center" es-transclude="beforeOption"><div ng-if="!ctrl.isOpen" class="text-nowrap" ng-switch="ctrl.ngModelCtrl.$isEmpty(ctrl.ngModel)"><span ng-switch-when="true" class="text-nowrap placeholder">{{ctrl.placeholder}}</span> <span ng-switch-default es-transclude="optionTemplate">{{ctrl.getModelLabel()}}</span></div><input ng-if="ctrl.isOpen" class="flex-grow-1" type="text" ng-model="ctrl.search" ng-change="ctrl.searchFn()" placeholder="{{ctrl.getModelLabel() || ctrl.placeholder}}" extended-select-search></div></div><div class="d-flex flex-row-reverse align-items-center" ng-if="::ctrl.multiple"><div class="d-flex"><div ng-show="ctrl.loading" class="flex-fill pl-1"><i class="fa fa-spinner fa-spin"></i></div></div><div class="d-flex flex-grow-1 flex-wrap"><div ng-if="!ctrl.ngModel.length && !ctrl.isOpen" class="text-nowrap placeholder">{{ctrl.placeholder}}</div><div class="d-flex extended-select-choice" ng-repeat="m in ctrl.ngModel" ng-if="ctrl.getModelLabel(m)"><span class="d-flex" es-transclude>{{::ctrl.getModelLabel(m)}}</span> <button type="button" class="close pl-1" ng-click="$event.stopPropagation();ctrl.deselect(m)" ng-if="!ctrl.isDisabled && !ctrl.isReadonly"><i class="fa fa-times"></i></button></div><input ng-if="ctrl.isOpen" class="flex-grow-1" type="text" ng-model="ctrl.search" ng-change="ctrl.searchFn()" placeholder="{{ctrl.ngModel.length ? \'\': ctrl.placeholder}}" extended-select-search> <a class="text-success" ng-click="$event.stopPropagation();ctrl.addOptionAction()" ng-if="ctrl.addOption && ctrl.search" title="{{::ctrl.addOptionLang}}"><i class="fa fa-plus"></i></a></div></div><div class="dropdown-menu" ng-click="$event.stopPropagation()" ng-hide="!ctrl.typeToSearch && !ctrl.options.length" extended-select-options="ctrl.activeIndex"><a href="javascript:" class="dropdown-item d-flex align-items-center" ng-repeat="o in ctrl.optionsFiltered" ng-click="ctrl.pickOption(o)" ng-class="{active: $index == ctrl.activeIndex, selected: ctrl.isSelected(o)}" es-transclude><extended-select-mark-result label="o.label"></extended-select-mark-result></a> <span class="dropdown-item-text" ng-show="ctrl.typeToSearch && ctrl.search.length < ctrl.typeToSearch">{{::ctrl.typeToSearchText}}</span> <a href="javascript:" class="dropdown-item text-primary" ng-show="ctrl.resolveOnSearch && ctrl.hasNextPage && (!ctrl.typeToSearch || ctrl.search.length >= ctrl.typeToSearch)" ng-click="ctrl.searchFn(ctrl.page + 1)">{{::ctrl.loadMoreResultsLang}}</a></div></div>');}]);