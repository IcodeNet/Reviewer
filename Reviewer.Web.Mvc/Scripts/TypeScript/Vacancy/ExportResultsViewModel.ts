/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../Shared/SearchFiltersViewModel.ts" />
/// <reference path="../HasCallbacks.ts" />

module ViewModels {

    export class ExportResultsViewModel extends HasCallbacks {
        
        private PostUrl: string;

        public FileName: KnockoutObservableString;
        public FileType: KnockoutObservableString;
        public SearchFilter: any;
        public SearchFiltersViewModel: any; 

        ExportElement: any;

        CanExport: KnockoutComputedFunctions;

        constructor(postUrl: string, searchFilterModel: any) {

            super();
            this.PostUrl = postUrl;
            
            this.FileName = ko.observable('');
            this.FileType = ko.observable('');
            this.SearchFilter = searchFilterModel;
            this.ExportElement = $('#ExportResultsViewModel')[0];
            this.SearchFiltersViewModel = new SearchFiltersViewModel(searchFilterModel.DomicileCountry, searchFilterModel.DomicileSite); 

            this.CanExport = ko.computed(this.cb_ComputeCanExport);
        }

        ShowExport() {
            $(this.ExportElement).modal();
        }

        cb_ShowExport() {
            this.ShowExport();
        }
        Export() {

            this.SearchFilter.FileName = this.FileName();
            this.SearchFilter.Exportfiletype = this.FileType();

            window.location.href = this.PostUrl + '?' + $.param(this.SearchFilter);;
        }

        ComputeCanExport() {
            if ($('#resultsGrid').is(':hidden')) {
            return true
            } else {
            return false
                }
        }
        
        cb_ComputeCanExport() {
            return this.ComputeCanExport();
        }

        cb_Export() {
            this.Export();
        }

        Close() {
        }

        cb_Close() { this.Close(); }
    }
}