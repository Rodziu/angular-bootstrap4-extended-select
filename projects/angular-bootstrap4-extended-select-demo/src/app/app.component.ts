/*
 * Angular Extended Select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

import {Component} from '@angular/core';
import {SectionDirective} from './section.directive';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IResolveOnSearchResult, Tree} from 'angular-bootstrap4-extended-select';

interface IExample {
    id: number,
    word: string
}

interface INestedGroups {
    label: string,
    items: string[],
    groups?: INestedGroups[]
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    nav: SectionDirective[] = [];
    loading = true;

    options: IExample[] = [];
    basicModel?: IExample;
    valueModel?: number;
    customTemplateModel?: IExample;
    beforeOptionModel?: IExample;
    multipleModel?: IExample[];
    groupByOptions: (IExample & { group: string })[] = [];
    groups = [
        {
            label: 'group1',
            items: [
                {id: 1, word: 'test'},
                {id: 2, word: 'test2'}
            ]
        },
        {
            label: 'group2',
            items: [
                {id: 3, word: 'test3'},
                {id: 4, word: 'test4'}
            ]
        }
    ]
    groupByModel?: IExample;

    nestedGroups: Tree<INestedGroups, 'groups'> = [
        {
            label: 'test3',
            items: ['a', 'b', 'c'],
            groups: [
                {
                    label: 'test2',
                    items: ['d', 'e', 'f'],
                    groups: [
                        {
                            label: 'test',
                            items: ['g']
                        }
                    ]
                },
                {
                    label: 'test6',
                    items: ['i', 'f']
                }
            ]
        },
        {
            label: 'test5',
            items: [],
            groups: [
                {
                    label: 'test4',
                    items: ['h']
                }
            ]
        }
    ];
    nestedByModel?: IExample;
    typeToSearchModel?: IExample;
    resolveOnSearchModel?: IExample;
    addOptionModel?: IExample;
    deselectableModel?: IExample;
    disabledModel?: IExample;
    placeholderModel?: IExample;
    sizingModel?: IExample;
    inlineModel?: IExample;

    resolvedOptions: IExample[] = [];
    emptyOptions: IExample[] = [];

    constructor(
        http: HttpClient
    ) {
        http.get('assets/mock_data.json').subscribe((data) => {
            this.options = (data as IExample[]);
            this.groupByOptions = this.options.map((option) => {
                return {
                    id: option.id,
                    word: option.word,
                    group: option.word.substring(0, 1)
                }
            })
            this.loading = false;
        });
    }

    resolveOnSearch(search: string, page: number): Observable<IResolveOnSearchResult<IExample>> {
        return new Observable<IResolveOnSearchResult<IExample>>((subscriber) => {
            search = search.toLowerCase();
            const results: IExample[] = [];
            let hasNextPage = false;
            this.options.some((option) => {
                if (option.word.includes(search)) {
                    if (results.length === (page * 10)) {
                        hasNextPage = true;
                        return true;
                    }
                    results.push(option);
                    if (!this.resolvedOptions.includes(option)) {
                        this.resolvedOptions.push(option);
                    }
                }
                return false;
            });

            this.resolvedOptions = this.resolvedOptions.sort((a, b) => {
                return a.word.localeCompare(b.word);
            });
            subscriber.next({hasNextPage, visibleOptions: results});
            subscriber.complete();
        });
    }

    addOption(newOption: string): void {
        this.emptyOptions.push({
            id: -1,
            word: newOption
        });
        this.addOptionModel = this.emptyOptions[this.emptyOptions.length - 1];
    }
}
