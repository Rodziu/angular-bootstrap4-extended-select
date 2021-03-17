/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */


import {IGroupItem} from './extended-select.component';
import * as angular from 'angular';
import {IComponentOptions} from 'angular';

/**
 * @ngInject
 */
class ExtendedSelectOptionGroupController {
    // bindings
    group: IGroupItem;
    prevGroup: IGroupItem;
    //
    groups: IGroupItem[];

    $onChanges(): void {
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

    getUntilLevel(group: IGroupItem, level: number): IGroupItem {
        while (group.level > level) {
            group = group.parent;
        }
        return group;
    }
}
export const extendedSelectOptionGroupComponent: IComponentOptions = {
    controller: ExtendedSelectOptionGroupController,
    controllerAs: 'vm',
    bindings: {
        group: '<',
        prevGroup: '<'
    },
    template: '<h6 class="dropdown-header" ng-repeat="group in vm.groups" '
        + 'ng-style="::{\'padding-left\': 10 + (group.level * 10) + \'px\'}">{{::group.name}}</h6>'
}
