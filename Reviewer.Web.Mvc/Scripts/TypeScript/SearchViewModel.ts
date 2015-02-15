/// <reference path="Definitions/jquery/jquery.d.ts" />
/// <reference path="Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="Definitions/linq/linq.d.ts" />
/// <reference path="Definitions/Knockout/knockout.d.ts" />
/// <reference path="HasCallbacks.ts" />
/// <reference path="Models.ts" />

module ViewModels {
    export class SearchViewModel extends HasCallbacks {
	    public Results: KnockoutObservableArray;

        public Page: KnockoutObservableNumber;
        public PageSize: KnockoutObservableNumber;
        public TotalPages: KnockoutObservableNumber;
        public TotalResults: KnockoutObservableNumber; 

        public PagerArray: KnockoutComputedFunctions;

        public IsLoading: KnockoutObservableBool; 
        public PageSpan: number;

        public OnSearchComplete: Function;

        SearchUri: string;  
        
        constructor(searchUri: string) 
        {
            super();
  
            this.PageSpan = 6;

            this.SearchUri = searchUri;

            this.Results = ko.observableArray();
            this.Page = ko.observable(0);
            this.PageSize = ko.observable(20);
            this.TotalPages = ko.observable(0);
            this.TotalResults = ko.observable(0);
            this.IsLoading = ko.observable(false);

            this.PagerArray = ko.computed(this.cb_ComputePagerArray);
        }

        Search(searchRequest: ISearchRequest)
        {
            if (searchRequest == null)
                searchRequest = <ISearchRequest>{};
            searchRequest.Page = this.Page();
            searchRequest.PageSize = this.PageSize();
            this.IsLoading(true);
	        $.get(this.SearchUri, searchRequest, (response) => {
                this.OnResponse(response);
                this.IsLoading(false);
            });
        }
        cb_Search() {
            this.Search(<ISearchRequest>{});
        }

        OnResponse(response : ISearchResponse)
        {
	        this.Page(response.Page);
            this.PageSize(response.PageSize);
            this.TotalPages(response.TotalPages);
            this.TotalResults(response.TotalResults);
            this.Results(response.Results);

            if (this.OnSearchComplete)
            {
                this.OnSearchComplete();
            }
        }

        ChangePage(page: number)
        {
            if(page == this.Page() ||
               page < 0 || page > this.TotalPages())
                return;

            this.Page(page);
            this.Search(<ISearchRequest>{});
        }
         
        ComputePagerArray() {
            var page = this.Page();
            var startPage = Math.max(0, page - (this.PageSpan / 2));

            var split = page - startPage;
            if(split < this.PageSpan)
                split = this.PageSpan - split;

            var total = this.TotalPages();
            var endPage = Math.min(page + split, total);

            var pages = new Array();
            for (var i = startPage; i <= endPage; i++)
            {
                pages.push(i);
            }

            return pages;
        }
        cb_ComputePagerArray() { return this.ComputePagerArray(); }
    }
}
	
