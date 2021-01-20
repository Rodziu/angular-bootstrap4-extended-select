/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

(function() {
    'use strict';

    /**
     * @ngInject
     */
    class ExtendedSelectOptionGroupController {
        $onChanges() {
            this.groups = [this.group];
            let group = this.group;
            while (angular.isDefined(group.parent)) {
                group = group.parent;
                if (
                    angular.isDefined(this.prevGroup)
                ) {
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

    angular
        .module('extendedSelect')
        .component('extendedSelectOptionGroup', {
            controller: ExtendedSelectOptionGroupController,
            controllerAs: 'vm',
            bindings: {
                group: '<',
                prevGroup: '<'
            },
            template: '<h6 class="dropdown-header" ng-repeat="group in vm.groups" '
                + 'ng-style="::{\'padding-left\': 10 + (group.level * 10) + \'px\'}">{{::group.name}}</h6>'
        });
}());
