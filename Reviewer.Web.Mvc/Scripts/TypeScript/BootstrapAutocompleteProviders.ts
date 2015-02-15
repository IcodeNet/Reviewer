/// <reference path="Definitions/jquery/jquery.d.ts" />
/// <reference path="Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="Definitions/linq/linq.d.ts" />
/// <reference path="HasCallbacks.ts" />

module BootstrapAutocompleteProviders {
    
    export class BaseProvider extends HasCallbacks {
        private Url: string;
        public Options: TypeaheadOptions;
        public Data: any[];
        
        constructor(url: string, options: TypeaheadOptions) {
            super();

            if (options == null)
            {
                options = { minLength: 2 };
            }

            this.Url = url;
            this.Options = options;
            this.Options.source = this.cb_Provide;
        }

        ApplyTo(element: JQuery)
        {
            element.typeahead(this.Options);
        }

        AlwaysTrueMatcher() { return true; }
        DefaultSorter(items: any) { return items; }

        GetDataIdentifiers(data: any) : string[] {
            return data;
        }

        Provide(query: string, callback: any) : void {
            $.getJSON(this.Url, { query: query }, (data) => {
                this.Data = data;
                callback(this.GetDataIdentifiers(this.Data));
            });
        }
        cb_Provide(query: string, callback: any) { this.Provide(query, callback); }
    }

    export class CostCentreProvider extends BaseProvider {

        constructor(url: string, options: TypeaheadOptions) {
            super(url, options);

            this.Options.matcher = <() => any>this.AlwaysTrueMatcher;
            this.Options.sorter = <() => any>this.DefaultSorter;
            this.Options.highlighter = <() => any>this.cb_Highlighter;
        }

        GetDataIdentifiers(data: any): string[]{
            return jQuery.map(data,
                (x: any) => {
                    return x.Code;
                }
            );
        }

        Highlighter(code: any): string {
            var costCentre = Enumerable.From(this.Data).First((x) => { return x.Code == code; });
            var html = costCentre.Code + " - " + costCentre.Name;
            return html;
        }
        cb_Highlighter(item: any) : string { return this.Highlighter(item); }
    }

    export class WFPUserBRIDProvider extends BaseProvider {
        constructor(url: string, options: TypeaheadOptions) {
            super(url, options);

            this.Options.matcher = <() => any>this.AlwaysTrueMatcher;
            this.Options.sorter = <() => any>this.DefaultSorter;
            this.Options.highlighter = <() => any>this.cb_Highlighter;
        }

        GetDataIdentifiers(data: any): string[]{
            return jQuery.map(data,
                (x: any) => {
                    return x.Username;
                }
            );
        }

        Highlighter(username: any): string {
            var user = Enumerable.From(this.Data).First((x) => { return x.Username == username; });
            return user.Username;
        }
        cb_Highlighter(item: any): string { return this.Highlighter(item); }
    }
}