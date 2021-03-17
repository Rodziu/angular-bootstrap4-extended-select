export interface IExtendedSelectOptions {
    placeholder: string;
    placeholderMultiple: string;
    typeToSearch: number;
    typeToSearchText: string;
    addOptionLang: string;
    loadMoreResultsLang: string;
    searchByValue: boolean;
}
export declare class ExtendedSelectProvider {
    options: IExtendedSelectOptions;
    $get(): IExtendedSelectOptions;
}
