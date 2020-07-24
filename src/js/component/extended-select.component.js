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

    /**
     * @ngdoc component
     * @name beforeOption
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
            beforeOption: '?beforeOption'
        },
        templateUrl: 'src/templates/extended-select.html',
        controllerAs: 'ctrl',
        controller: ExtendedSelectComponentController
    });

}());
