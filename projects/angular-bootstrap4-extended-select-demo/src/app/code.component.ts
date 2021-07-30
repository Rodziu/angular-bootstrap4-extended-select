/*
 * Angular Extended Select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
import {Component} from '@angular/core';

@Component({
    selector: 'pre:not(.no-code)',
    template: '<label class="mt-2">Code:</label><div class="card card-body bg-light"><ng-content></ng-content></div>'
})
export class CodeComponent {

}
