/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />

module ViewModels {

    interface ICopyVacancyResponse {
        Results: ICopyVacancyResultItem[];
    }
     
    interface ICopyVacancyResultItem {
        Errors: string[]; 
        OriginalVacancyId: number;
        NewVacancyId: number;
    }
     
	export class CopyVacanciesViewModel extends HasCallbacks {
	    CopyUri: string;
	    VacancyUri: string;
        Element : any; 
        Vacancies: KnockoutObservableArray;
        IsLoading: KnockoutObservableBool;

        OnCopy: Function;

        CanCopy: KnockoutComputedFunctions;

        constructor(copyUri : string, vacancyUri: string, element : any)
        {
            super();
            this.CopyUri = copyUri;
            this.VacancyUri = vacancyUri;
            this.Element = element;
            this.IsLoading = ko.observable(false);
            this.Vacancies = ko.observableArray(new Array());
            this.CanCopy = ko.computed(this.cb_ComputeCanCopy);
        }

        ComputeCanCopy() : boolean
        {
            var count = Enumerable.From(this.Vacancies()).Where(x => x.CopyResult() == '').Count();
            if (count == 0 || this.IsLoading())
                return false;
            else
                return true;
        }
        cb_ComputeCanCopy() { return this.ComputeCanCopy(); }

        Copy() {
            var vacancies = Enumerable.From(this.Vacancies()).Where(x => x.CopyResult() == '');
            var data = {
                vacancyIds: vacancies.Select(x => x.VacancyId).ToArray()
            };

            this.IsLoading(true);

            var tThis = this;

            $.ajax({
                type: "POST",
                url: this.CopyUri,
                data: data,
                dataType: "json",
                traditional: true,
                success: (result: ICopyVacancyResponse) => {

                    Enumerable.From(result.Results).ForEach((item: ICopyVacancyResultItem) => {
                        var vacancy = vacancies.First(x => x.VacancyId == item.OriginalVacancyId);
                        if (item.Errors == null || item.Errors.length == 0) {
                            vacancy.CopyResult('Vacancy copied succesfully.<br /><a class="btn" href="' + (<any>this).VacancyUri.format(item.NewVacancyId) + '">Open</a>');
                        }
                        else {
                            vacancy.CopyResult('Errors whilst copying.');
                        }
                        this.IsLoading(false);

                        if (this.OnCopy != null)
                            this.OnCopy();
                    });

                }
            });
        }
        cb_Copy() { this.Copy(); } 

        Close() {
            $(this.Element).modal('hide');
        }
        cb_Close() { this.Close(); }
    }
}

