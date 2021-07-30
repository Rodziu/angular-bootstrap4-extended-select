import {QueryList} from '@angular/core';
import {IEsOptionComponent} from '../es-option/es-option-component.interface';
import {EsOptionsDirective} from '../es-options.directive';
import {IExtendedSelectComponent} from '../extended-select/extended-select-component.interface';

export interface IEsOptionGroupComponent<T> {
    esOptions: EsOptionsDirective<T>;
    hidden: boolean;
    optionComponents?: QueryList<IEsOptionComponent<T>>;
    extendedSelect: IExtendedSelectComponent<T>;
}
