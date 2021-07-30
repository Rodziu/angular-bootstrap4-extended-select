/*
 * Angular Extended Select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import {
    Directive, DoCheck,
    Input,
    IterableDiffer,
    IterableDiffers,
    TemplateRef, ViewContainerRef
} from '@angular/core';

export type Tree<T, U extends keyof T = keyof T> = (T & {
    [P in U]?: Tree<T, U>
})[];

export interface IEsOptionGroupsContext<T> {
    $implicit: T,
    level: number
}

@Directive({
    selector: '[esOptionGroups][esOptionGroupsOf]'
})
export class EsOptionGroupsDirective<T,
    S extends keyof T = keyof T,
    U extends Tree<T, S> = Tree<T, S>> implements DoCheck {
    @Input() esOptionGroupsOf?: U;
    @Input() esOptionGroupsNestedBy?: S;
    level = 0;

    private _differ?: IterableDiffer<unknown>;

    constructor(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public readonly template: TemplateRef<IEsOptionGroupsContext<U extends Tree<infer P, any> ? P : never>>,
        private _iterableDiffers: IterableDiffers,
        private _viewContainer: ViewContainerRef,
    ) {
    }

    ngDoCheck(): void {
        if (!this._differ && this.esOptionGroupsOf) {
            try {
                this._differ = this._iterableDiffers.find(this.esOptionGroupsOf).create();
            } catch {
                throw new Error(
                    `Cannot find a differ supporting object '${this.esOptionGroupsOf}' of type 
                    '${typeof this.esOptionGroupsOf}'. esOptionsOf only supports binding to Arrays.`
                );
            }
            this._render(this.esOptionGroupsOf);
        }
        if (this._differ && this._differ.diff(this.esOptionGroupsOf)) {
            this._viewContainer.clear();
            this._render(this.esOptionGroupsOf as U);
        }
    }

    private _render(optionGroups: U): void {
        this._walkTree(optionGroups, (group, level) => {
            this._viewContainer.createEmbeddedView(this.template, {$implicit: group, level})
        })
    }

    private _walkTree(
        tree: U,
        callback: (branch: T, level: number) => void,
        level = 0
    ): void {
        tree.forEach((branch) => {
            this.level = level;
            callback(branch, level);
            if (this.esOptionGroupsNestedBy && Array.isArray(branch[this.esOptionGroupsNestedBy])) {
                this._walkTree(branch[this.esOptionGroupsNestedBy] as unknown as U, callback, level + 1);
            }
        });
    }
}
