(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("angularjs-bootstrap-4"));
	else if(typeof define === 'function' && define.amd)
		define("angularjs-bootstrap4-extended-select", ["angular", "angularjs-bootstrap-4"], factory);
	else if(typeof exports === 'object')
		exports["angularjs-bootstrap4-extended-select"] = factory(require("angular"), require("angularjs-bootstrap-4"));
	else
		root["angularjs-bootstrap4-extended-select"] = factory(root["angular"], root["angularjs-bootstrap-4"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_angular__, __WEBPACK_EXTERNAL_MODULE_angularjs_bootstrap_4__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./.build/lib/component/es-transclude.directive.js":
/*!*********************************************************!*\
  !*** ./.build/lib/component/es-transclude.directive.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "esTranscludeDirective": () => (/* binding */ esTranscludeDirective)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

function esTranscludeDirective() {
    /**
     * @ngdoc directive
     * @name esTransclude
     */
    return {
        restrict: 'A',
        require: '^extendedSelect',
        link: function (scope, element, attrs, ctrl, transclude) {
            const slots = attrs['esTransclude'] ? [attrs['esTransclude']] : ['optionTemplate', 'beforeOption'];
            slots.forEach((slot) => {
                if (transclude.isSlotFilled(slot)) {
                    transclude((clone, transcludedScope) => {
                        transcludedScope.$extendedSelect = ctrl;
                        transcludedScope.$option = scope['o'];
                        transcludedScope.$isOption = true;
                        if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(scope['o'])) {
                            transcludedScope.$isOption = false;
                            if (ctrl.multiple) {
                                transcludedScope.$option = {
                                    value: scope['m'],
                                    label: ctrl.getModelLabel(scope['m'])
                                };
                            }
                            else {
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
                        }
                        else {
                            element.prepend(clone);
                        }
                    }, null, slot);
                }
            });
        }
    };
}



/***/ }),

/***/ "./.build/lib/component/extended-select-mark-result.component.js":
/*!***********************************************************************!*\
  !*** ./.build/lib/component/extended-select-mark-result.component.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extendedSelectMarkResultComponent": () => (/* binding */ extendedSelectMarkResultComponent)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

/**
 * @ngInject
 */
class ExtendedSelectMarkResultComponentController {
    constructor($element) {
        this.$element = $element;
    }
    $doCheck() {
        if (this.extendedSelect.search !== this._search) {
            this._update();
        }
    }
    $onChanges() {
        this._update();
    }
    _update() {
        this._search = this.extendedSelect.search;
        let html = this.label;
        if (this.label && angular__WEBPACK_IMPORTED_MODULE_0__.isString(this._search) && this._search.length) {
            html = this.label.replace(new RegExp('(' + this._search + ')', 'gi'), '<u>$1</u>');
        }
        this.$element.html(html);
    }
}
ExtendedSelectMarkResultComponentController.$inject = ["$element"];
/**
 * @ngdoc component
 * @name extendedSelectMarkResult
 * @param {expression} label
 */
const extendedSelectMarkResultComponent = {
    require: {
        extendedSelect: '^extendedSelect'
    },
    bindings: {
        label: '<'
    },
    controllerAs: 'vm',
    controller: ExtendedSelectMarkResultComponentController
};



/***/ }),

/***/ "./.build/lib/component/extended-select-option-group.component.js":
/*!************************************************************************!*\
  !*** ./.build/lib/component/extended-select-option-group.component.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extendedSelectOptionGroupComponent": () => (/* binding */ extendedSelectOptionGroupComponent)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

/**
 * @ngInject
 */
class ExtendedSelectOptionGroupController {
    $onChanges() {
        this.groups = [this.group];
        let group = this.group;
        while (angular__WEBPACK_IMPORTED_MODULE_0__.isDefined(group.parent)) {
            group = group.parent;
            if (angular__WEBPACK_IMPORTED_MODULE_0__.isDefined(this.prevGroup)) {
                let commonAncestor = this.prevGroup;
                if (commonAncestor.level > group.level) {
                    commonAncestor = this.getUntilLevel(commonAncestor, group.level);
                }
                if (commonAncestor.name === group.name) {
                    break;
                }
            }
            this.groups.unshift(group);
        }
    }
    getUntilLevel(group, level) {
        while (group.level > level) {
            group = group.parent;
        }
        return group;
    }
}
const extendedSelectOptionGroupComponent = {
    controller: ExtendedSelectOptionGroupController,
    controllerAs: 'vm',
    bindings: {
        group: '<',
        prevGroup: '<'
    },
    template: '<h6 class="dropdown-header" ng-repeat="group in vm.groups" '
        + 'ng-style="::{\'padding-left\': 10 + (group.level * 10) + \'px\'}">{{::group.name}}</h6>'
};



/***/ }),

/***/ "./.build/lib/component/extended-select-options.directive.js":
/*!*******************************************************************!*\
  !*** ./.build/lib/component/extended-select-options.directive.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extendedSelectOptionsDirective": () => (/* binding */ extendedSelectOptionsDirective)
/* harmony export */ });
/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
/**
 * @ngInject
 */
class ExtendedSelectOptionsDirectiveController {
    constructor($element, angularBS) {
        this.$element = $element;
        this.angularBS = angularBS;
    }
    $onChanges() {
        const item = this.$element[0].querySelector(`.dropdown-item:nth-child(${this.activeIndex + 1})`);
        if (item === null) {
            return;
        }
        const top = item.offsetTop, scroll = this.$element[0].scrollTop, bot = this.angularBS.offset(item).height + top, ulHeight = this.angularBS.offset(this.$element[0]).height;
        if (scroll - top > 0) { // move it up
            this.$element[0].scrollTop = top;
        }
        else if (scroll - bot < ulHeight * -1) { // move it down
            this.$element[0].scrollTop = bot - ulHeight;
        }
    }
}
ExtendedSelectOptionsDirectiveController.$inject = ["$element", "angularBS"];
function extendedSelectOptionsDirective() {
    /**
     * @ngdoc directive
     * @name extendedSelectOptions
     * @description automatically scroll dropdown window to highlighted option
     */
    return {
        restrict: 'A',
        bindToController: {
            activeIndex: '<extendedSelectOptions'
        },
        controller: ExtendedSelectOptionsDirectiveController
    };
}



/***/ }),

/***/ "./.build/lib/component/extended-select-search.directive.js":
/*!******************************************************************!*\
  !*** ./.build/lib/component/extended-select-search.directive.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extendedSelectSearchDirective": () => (/* binding */ extendedSelectSearchDirective)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

/**
 * @ngInject
 */
function extendedSelectSearchDirective($injector) {
    /**
     * @ngdoc directive
     * @name extendedSelectSearch
     * @description search element
     */
    return {
        restrict: 'A',
        require: '^extendedSelect',
        link: function (scope, element, attrs, ctrl) {
            if ($injector.has('$animate')) {
                $injector.get('$animate').enabled(element, false);
            }
            element[0].focus();
            /**
             * move selection or pick an option on keydown
             */
            element.on('keydown', function (e) {
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
                        if (angular__WEBPACK_IMPORTED_MODULE_0__.isDefined(ctrl.optionsFiltered[ctrl.activeIndex])) {
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
extendedSelectSearchDirective.$inject = ["$injector"];



/***/ }),

/***/ "./.build/lib/component/extended-select.component.js":
/*!***********************************************************!*\
  !*** ./.build/lib/component/extended-select.component.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExtendedSelectComponentController": () => (/* binding */ ExtendedSelectComponentController),
/* harmony export */   "extendedSelectComponent": () => (/* binding */ extendedSelectComponent)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

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
        this.options = [];
        this.optionsFiltered = [];
        this.activeIndex = -1;
        this.search = '';
        this._searchTimeout = null;
        this._transcludedOptions = [];
        this._ngOptions = 'ngOptions' in $attrs
            ? extendedSelectOptions.parseNgOptions($attrs['ngOptions']) : null;
        this.multiple = 'multiple' in this.$attrs;
        this.placeholder = 'multiple' in this.$attrs
            ? this.extendedSelect.placeholderMultiple : this.extendedSelect.placeholder;
    }
    $onInit() {
        if (!this.deselectable && 'deselectable' in this.$attrs && !this.$attrs.deselectable.length) {
            this.deselectable = true;
        }
        this.addOptionLang = this.extendedSelect.addOptionLang;
        this.loadMoreResultsLang = this.extendedSelect.loadMoreResultsLang;
        this.typeToSearchText = this.extendedSelect.typeToSearchText;
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(this.typeToSearch)) {
            this.typeToSearch = this.extendedSelect.typeToSearch;
        }
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(this.searchByValue)) {
            this.searchByValue = this.extendedSelect.searchByValue;
        }
        if (this.multiple) {
            this.ngModelCtrl.$isEmpty = function (value) {
                return !value || value.length === 0;
            };
        }
        this._transcludedOptions = [];
        this.$transclude((clone) => {
            angular__WEBPACK_IMPORTED_MODULE_0__.forEach(clone, (optionElement) => {
                this._transcludedOptions.push({
                    value: optionElement.value,
                    label: optionElement.textContent
                });
            });
        }, null, 'option');
        //
        this.$attrs.$observe('placeholder', (value) => {
            this.placeholder = value;
        });
        this.$attrs.$observe('disabled', (value) => {
            this.isDisabled = value === true || angular__WEBPACK_IMPORTED_MODULE_0__.isString(value);
        });
        this.$attrs.$observe('readonly', (value) => {
            this.isReadonly = value === true || angular__WEBPACK_IMPORTED_MODULE_0__.isString(value);
        });
    }
    $doCheck() {
        this.isSmall = this.$element.hasClass('custom-select-sm');
        this.isLarge = this.$element.hasClass('custom-select-lg');
        if (this._ngOptions !== null) {
            const optionObjects = this._ngOptions.valuesFn(this.$scope.$parent);
            if (angular__WEBPACK_IMPORTED_MODULE_0__.isDefined(optionObjects) && !angular__WEBPACK_IMPORTED_MODULE_0__.equals(optionObjects, this._optionObjects)) {
                this._optionObjects = angular__WEBPACK_IMPORTED_MODULE_0__.copy(optionObjects);
                this.updateOptions(optionObjects);
            }
        }
    }
    updateOptions(optionObjects) {
        const options = angular__WEBPACK_IMPORTED_MODULE_0__.copy(this._transcludedOptions), groups = [], groupsTree = [], addGroup = (groupName, parentGroup) => {
            if (angular__WEBPACK_IMPORTED_MODULE_0__.isDefined(parentGroup)) {
                addGroup(parentGroup);
            }
            let groupItem = groups.find((item) => {
                return item.name === groupName;
            });
            if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(groupItem)) {
                groupItem = {
                    name: groupName,
                    parentGroup,
                    children: []
                };
                groups.push(groupItem);
            }
            else if (angular__WEBPACK_IMPORTED_MODULE_0__.isDefined(parentGroup) && groupItem.parentGroup !== parentGroup) {
                groupItem.parentGroup = parentGroup;
            }
            return groupItem;
        };
        let pickLater;
        optionObjects.forEach((optionObject, key) => {
            const locals = this._ngOptions.getLocals(key, optionObject), groupName = this._ngOptions.groupByFn(this.$scope.$parent, locals), parentGroup = this._ngOptions.nestedByFn(this.$scope.$parent, locals);
            options.push({
                value: this._ngOptions.valueFn(this.$scope.$parent, locals),
                label: this._ngOptions.displayFn(this.$scope.$parent, locals),
                group: angular__WEBPACK_IMPORTED_MODULE_0__.isDefined(groupName) ? addGroup(groupName, parentGroup) : undefined
            });
            if (this._addOptionCalled && options[options.length - 1].label === this.search) {
                pickLater = options[options.length - 1];
                this._addOptionCalled = false;
            }
        });
        if (groups.length) {
            groups.forEach((item) => {
                let parent, parentChildren;
                if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(item.parentGroup)) {
                    parentChildren = groupsTree;
                }
                else {
                    parent = groups.find((subItem) => {
                        return subItem.name === item.parentGroup;
                    });
                    parentChildren = parent.children;
                }
                item.parent = parent;
                parentChildren.push(item);
            });
            const order = [], walkTree = (branch, level = 0) => {
                branch.forEach((item) => {
                    order.push(item.name);
                    item.level = level;
                    walkTree(item.children, level + 1);
                });
            };
            walkTree(groupsTree);
            options.sort((a, b) => {
                return order.indexOf(a.group.name) - order.indexOf(b.group.name);
            });
        }
        this.options = options;
        if (pickLater) {
            // in multiple mode, we need to wait until new option is added to this.options
            // before selecting it
            this.pickOption(pickLater);
        }
        this.filterData();
    }
    open() {
        const wasOpen = this.isOpen;
        this.ngModelCtrl.$setTouched();
        if (this.isDisabled || this.isReadonly) {
            this.isOpen = false;
        }
        else {
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
            if ((this.isSelected(option)
                || angular__WEBPACK_IMPORTED_MODULE_0__.equals(option.value, newValue))
                && !angular__WEBPACK_IMPORTED_MODULE_0__.equals(option.value, removeValue)
                && !sorted.includes(option.value)) {
                sorted.push(option.value);
            }
        });
        if (!angular__WEBPACK_IMPORTED_MODULE_0__.equals(this.ngModel, sorted)) {
            this.ngModel = sorted;
        }
    }
    filterData() {
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(this.search)) {
            angular__WEBPACK_IMPORTED_MODULE_0__.copy(this.options, this.optionsFiltered);
            return;
        }
        angular__WEBPACK_IMPORTED_MODULE_0__.copy([], this.optionsFiltered);
        if (this.search.length < this.typeToSearch) {
            return;
        }
        const search = this.search.toLowerCase();
        this.options.forEach((option) => {
            if (option.label.toLowerCase().includes(search)
                || (this.searchByValue
                    && ((angular__WEBPACK_IMPORTED_MODULE_0__.isString(option.value)
                        && option.value.toLowerCase().includes(search))
                        || (angular__WEBPACK_IMPORTED_MODULE_0__.isObject(option.value)
                            && angular__WEBPACK_IMPORTED_MODULE_0__.toJson(option.value).toLowerCase().includes(search))))) {
                this.optionsFiltered.push(option);
            }
        });
    }
    isSelected(option) {
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(this.ngModel)) {
            return false;
        }
        if (this.multiple) {
            return this.ngModel.includes(option.value);
        }
        return angular__WEBPACK_IMPORTED_MODULE_0__.equals(option.value, this.ngModel);
    }
    getModelLabel(value) {
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(value)) {
            value = this.ngModel;
        }
        const option = this.options.find((option) => {
            return angular__WEBPACK_IMPORTED_MODULE_0__.equals(option.value, value);
        });
        return option ? option.label : '';
    }
    searchFn(page) {
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(page)) {
            this.activeIndex = this.options.length ? 0 : -1;
        }
        this.hasNextPage = false;
        this.filterData();
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isFunction(this.resolveOnSearch)) {
            this.page = page || 1;
            if (angular__WEBPACK_IMPORTED_MODULE_0__.isDefined(this.search) && this.search.length) {
                const timeout = angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(this._lastSearchValue) ? 0 : 750;
                if (this._searchTimeout !== null) {
                    this.$timeout.cancel(this._searchTimeout);
                }
                this._lastSearchValue = this.search;
                this.loading = true;
                this._searchTimeout = this.$timeout(() => {
                    this._searchTimeout = null;
                    this.resolveOnSearch({ value: this.search, page: this.page })
                        .then((response) => {
                        this._lastSearchValue = undefined;
                        this.loading = false;
                        this.hasNextPage = response && !!response.hasNextPage;
                        this.filterData();
                    }).catch(angular__WEBPACK_IMPORTED_MODULE_0__.noop);
                }, timeout);
            }
        }
    }
    pickOption(option) {
        if (this.multiple) {
            if (angular__WEBPACK_IMPORTED_MODULE_0__.isUndefined(this.ngModel)) {
                this.ngModel = [];
            }
            if (!this.ngModel.includes(option.value)) {
                this._updateMultipleModel(option.value);
            }
            this.activeIndex = -1;
            this.search = '';
        }
        else {
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
        }
        else {
            this.ngModel = this.deselectValue;
        }
        this.activeIndex = -1;
        this.ngModelCtrl.$setViewValue(this.ngModel);
    }
    addOptionAction() {
        if (angular__WEBPACK_IMPORTED_MODULE_0__.isFunction(this.addOption) && this.search.length) {
            const option = this.options.find((option) => {
                return option.label === this.search;
            });
            if (option) {
                this.pickOption(option);
            }
            else {
                this.addOption({ value: this.search });
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
const extendedSelectComponent = {
    require: {
        ngModelCtrl: 'ngModel'
    },
    bindings: {
        ngModel: '=',
        addOption: '&?',
        resolveOnSearch: '&?',
        deselectable: '<?',
        deselectValue: '<?',
        typeToSearch: '<?',
        searchByValue: '<?'
    },
    transclude: {
        option: '?option',
        beforeOption: '?beforeOption',
        optionTemplate: '?optionTemplate'
    },
    template:'<div class="dropdown custom-select angular-extended-select" bs-dropdown="ctrl.isOpen" ng-click="ctrl.open()" ng-class="{\'custom-select-sm\': ctrl.isSmall, \'custom-select-lg\': ctrl.isLarge}" ng-disabled="ctrl.isDisabled" ng-readonly="ctrl.isReadonly"><div class="d-flex flex-row-reverse align-items-center" ng-if="::!ctrl.multiple"><div class="d-flex"><div ng-show="ctrl.loading" class="flex-fill pl-1"><i class="fa fa-spinner fa-spin"></i></div><a class="text-success flex-fill pl-1" ng-click="$event.stopPropagation();ctrl.addOptionAction()" ng-if="ctrl.addOption && ctrl.search" title="{{::ctrl.addOptionLang}}"><i class="fa fa-plus"></i></a> <a class="text-danger flex-fill pl-1" ng-click="ctrl.deselect()" ng-if="ctrl.deselectable && ctrl.getModelLabel() && !ctrl.isDisabled && !ctrl.isReadonly"><i class="fa fa-times"></i></a></div><div class="d-flex flex-grow-1 align-items-center" es-transclude="beforeOption"><div ng-show="!ctrl.isOpen" class="text-nowrap" ng-switch="ctrl.ngModelCtrl.$isEmpty(ctrl.ngModel)"><span ng-switch-when="true" class="text-nowrap placeholder">{{ctrl.placeholder}}</span> <span ng-switch-default es-transclude="optionTemplate">{{ctrl.getModelLabel()}}</span></div><input ng-if="ctrl.isOpen" class="flex-grow-1" type="text" ng-model="ctrl.search" ng-change="ctrl.searchFn()" placeholder="{{ctrl.getModelLabel() || ctrl.placeholder}}" extended-select-search></div></div><div class="d-flex flex-row-reverse align-items-center" ng-if="::ctrl.multiple"><div class="d-flex"><div ng-show="ctrl.loading" class="flex-fill pl-1"><i class="fa fa-spinner fa-spin"></i></div></div><div class="d-flex flex-grow-1 flex-wrap"><div ng-if="!ctrl.ngModel.length && !ctrl.isOpen" class="text-nowrap placeholder">{{ctrl.placeholder}}</div><div class="d-flex extended-select-choice" ng-repeat="m in ctrl.ngModel" ng-if="ctrl.getModelLabel(m)"><span class="d-flex" es-transclude>{{::ctrl.getModelLabel(m)}}</span> <button type="button" class="close pl-1" ng-click="$event.stopPropagation();ctrl.deselect(m)" ng-if="!ctrl.isDisabled && !ctrl.isReadonly"><i class="fa fa-times"></i></button></div><input ng-if="ctrl.isOpen" class="flex-grow-1" type="text" ng-model="ctrl.search" ng-change="ctrl.searchFn()" placeholder="{{ctrl.ngModel.length ? \'\': ctrl.placeholder}}" extended-select-search> <a class="text-success" ng-click="$event.stopPropagation();ctrl.addOptionAction()" ng-if="ctrl.addOption && ctrl.search" title="{{::ctrl.addOptionLang}}"><i class="fa fa-plus"></i></a></div></div><div class="dropdown-menu" ng-click="$event.stopPropagation()" ng-hide="!ctrl.typeToSearch && !ctrl.options.length" extended-select-options="ctrl.activeIndex"><div ng-repeat="o in ctrl.optionsFiltered"><extended-select-option-group group="o.group" prev-group="ctrl.optionsFiltered[$index - 1].group" ng-if="o.group && ($first || ctrl.optionsFiltered[$index - 1].group !== o.group)"></extended-select-option-group><a href="javascript:" class="dropdown-item d-flex align-items-center" ng-style="::o.group ? {\'padding-left\': 10 + ((o.group.level + 1) * 10) + \'px\'} : {}" ng-click="ctrl.pickOption(o)" ng-class="{active: $index == ctrl.activeIndex, selected: ctrl.isSelected(o)}" es-transclude><extended-select-mark-result label="o.label"></extended-select-mark-result></a></div><span class="dropdown-item-text" ng-show="ctrl.typeToSearch && ctrl.search.length < ctrl.typeToSearch">{{::ctrl.typeToSearchText}}</span> <a href="javascript:" class="dropdown-item text-primary" ng-show="ctrl.resolveOnSearch && ctrl.hasNextPage && (!ctrl.typeToSearch || ctrl.search.length >= ctrl.typeToSearch)" ng-click="ctrl.searchFn(ctrl.page + 1)">{{::ctrl.loadMoreResultsLang}}</a></div></div>',
    controllerAs: 'ctrl',
    controller: ExtendedSelectComponentController
};



/***/ }),

/***/ "./.build/lib/extended-select.config.js":
/*!**********************************************!*\
  !*** ./.build/lib/extended-select.config.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extendedSelectConfig": () => (/* binding */ extendedSelectConfig)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

/**
 * Prevent ng-options directive from compiling on angular-extended-select
 * @ngInject
 */
function extendedSelectConfig($provide) {
    const blocked = ['ngOptions', 'select'];
    angular__WEBPACK_IMPORTED_MODULE_0__.forEach(blocked, function (directiveName) {
        $provide.decorator(directiveName + 'Directive', ['$delegate', function ($delegate) {
                angular__WEBPACK_IMPORTED_MODULE_0__.forEach($delegate, function (directive) {
                    const compile_ = directive.compile || angular__WEBPACK_IMPORTED_MODULE_0__.noop;
                    directive.compile = function (element, attrs, transclude) {
                        if (element[0].tagName === 'EXTENDED-SELECT') {
                            directive.terminal = false;
                            return;
                        }
                        return compile_.apply(this, [element, attrs, transclude]) || directive.link;
                    };
                });
                return $delegate;
            }]);
    });
}
extendedSelectConfig.$inject = ["$provide"];



/***/ }),

/***/ "./.build/lib/extended-select.module.js":
/*!**********************************************!*\
  !*** ./.build/lib/extended-select.module.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extendedSelect": () => (/* binding */ extendedSelect)
/* harmony export */ });
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var angularjs_bootstrap_4__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angularjs-bootstrap-4 */ "angularjs-bootstrap-4");
/* harmony import */ var angularjs_bootstrap_4__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(angularjs_bootstrap_4__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _extended_select_provider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extended-select.provider */ "./.build/lib/extended-select.provider.js");
/* harmony import */ var _extended_select_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./extended-select.config */ "./.build/lib/extended-select.config.js");
/* harmony import */ var _service_extended_select_options_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./service/extended-select-options.service */ "./.build/lib/service/extended-select-options.service.js");
/* harmony import */ var _component_extended_select_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./component/extended-select.component */ "./.build/lib/component/extended-select.component.js");
/* harmony import */ var _component_es_transclude_directive__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./component/es-transclude.directive */ "./.build/lib/component/es-transclude.directive.js");
/* harmony import */ var _component_extended_select_mark_result_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./component/extended-select-mark-result.component */ "./.build/lib/component/extended-select-mark-result.component.js");
/* harmony import */ var _component_extended_select_option_group_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./component/extended-select-option-group.component */ "./.build/lib/component/extended-select-option-group.component.js");
/* harmony import */ var _component_extended_select_options_directive__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./component/extended-select-options.directive */ "./.build/lib/component/extended-select-options.directive.js");
/* harmony import */ var _component_extended_select_search_directive__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./component/extended-select-search.directive */ "./.build/lib/component/extended-select-search.directive.js");
/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */











const extendedSelectModule = angular__WEBPACK_IMPORTED_MODULE_0__.module('extendedSelect', [(angularjs_bootstrap_4__WEBPACK_IMPORTED_MODULE_1___default())])
    .provider('extendedSelect', _extended_select_provider__WEBPACK_IMPORTED_MODULE_2__.ExtendedSelectProvider)
    .config(_extended_select_config__WEBPACK_IMPORTED_MODULE_3__.extendedSelectConfig)
    .factory('extendedSelectOptions', _service_extended_select_options_service__WEBPACK_IMPORTED_MODULE_4__.ExtendedSelectOptionsService)
    .component('extendedSelect', _component_extended_select_component__WEBPACK_IMPORTED_MODULE_5__.extendedSelectComponent)
    .directive('esTransclude', _component_es_transclude_directive__WEBPACK_IMPORTED_MODULE_6__.esTranscludeDirective)
    .component('extendedSelectMarkResult', _component_extended_select_mark_result_component__WEBPACK_IMPORTED_MODULE_7__.extendedSelectMarkResultComponent)
    .component('extendedSelectOptionGroup', _component_extended_select_option_group_component__WEBPACK_IMPORTED_MODULE_8__.extendedSelectOptionGroupComponent)
    .directive('extendedSelectOptions', _component_extended_select_options_directive__WEBPACK_IMPORTED_MODULE_9__.extendedSelectOptionsDirective)
    .directive('extendedSelectSearch', _component_extended_select_search_directive__WEBPACK_IMPORTED_MODULE_10__.extendedSelectSearchDirective);
const extendedSelect = extendedSelectModule.name;



/***/ }),

/***/ "./.build/lib/extended-select.provider.js":
/*!************************************************!*\
  !*** ./.build/lib/extended-select.provider.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExtendedSelectProvider": () => (/* binding */ ExtendedSelectProvider)
/* harmony export */ });
/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
class ExtendedSelectProvider {
    constructor() {
        this.options = {
            placeholder: '\u00A0',
            placeholderMultiple: '\u00A0',
            typeToSearch: 0,
            typeToSearchText: 'Begin typing to display available options',
            addOptionLang: 'Add',
            loadMoreResultsLang: 'Load more results',
            searchByValue: false
        };
    }
    $get() {
        return this.options;
    }
}



/***/ }),

/***/ "./.build/lib/service/extended-select-options.service.js":
/*!***************************************************************!*\
  !*** ./.build/lib/service/extended-select-options.service.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExtendedSelectOptionsService": () => (/* binding */ ExtendedSelectOptionsService)
/* harmony export */ });
/**
 * Parse ng-options in angular way.
 * 1: value expression (valueFn)
 * 2: label expression (displayFn)
 * 3: group by expression (groupByFn)
 * 4: nested by expression (nestedByFn)
 * 5: disable when expression (disableWhenFn)
 * 6: array item variable name
 * 7: object item key variable name
 * 8: object item value variable name
 * 9: collection expression
 * 10: track by expression
 * @type {RegExp}
 */
// eslint-disable-next-line max-len
const NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?)(?:\s+nested\s+by\s+([\s\S]+?))?)?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([$\w][$\w]*)|(?:\(\s*([$\w][$\w]*)\s*,\s*([$\w][$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
/**
 * @ngInject
 */
class ExtendedSelectOptionsService {
    constructor($parse) {
        this.$parse = $parse;
    }
    parseNgOptions(ngOptionsString) {
        const match = ngOptionsString.match(NG_OPTIONS_REGEXP);
        if (match === null) {
            return null;
        }
        const valueName = match[6] || match[8], keyName = match[7];
        return {
            valueFn: this.$parse(match[2] ? match[1] : valueName),
            displayFn: this.$parse(match[2] || match[1]),
            groupByFn: this.$parse(match[3] || ''),
            nestedByFn: this.$parse(match[4] || ''),
            valuesFn: this.$parse(match[9]),
            getLocals: (key, value) => {
                const locals = {};
                locals[valueName] = value;
                if (keyName) {
                    locals[keyName] = key;
                }
                return locals;
            }
        };
    }
}
ExtendedSelectOptionsService.$inject = ["$parse"];



/***/ }),

/***/ "angular":
/*!**************************!*\
  !*** external "angular" ***!
  \**************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_angular__;

/***/ }),

/***/ "angularjs-bootstrap-4":
/*!****************************************!*\
  !*** external "angularjs-bootstrap-4" ***!
  \****************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_angularjs_bootstrap_4__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************************************!*\
  !*** ./.build/angularjs-bootstrap4-extended-select.js ***!
  \********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExtendedSelectOptionsService": () => (/* reexport safe */ _lib_service_extended_select_options_service__WEBPACK_IMPORTED_MODULE_1__.ExtendedSelectOptionsService),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_extended_select_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/extended-select.module */ "./.build/lib/extended-select.module.js");
/* harmony import */ var _lib_service_extended_select_options_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/service/extended-select-options.service */ "./.build/lib/service/extended-select-options.service.js");
/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_lib_extended_select_module__WEBPACK_IMPORTED_MODULE_0__.extendedSelect);


})();

__webpack_exports__ = __webpack_exports__.default;
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=angularjs-bootstrap4-extended-select.js.map