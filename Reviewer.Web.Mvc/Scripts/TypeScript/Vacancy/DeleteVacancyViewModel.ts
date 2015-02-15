/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />

module ViewModels {

	export class DeleteVacancyViewModel extends HasCallbacks {
	    DeleteUri: string;
        Element : any; 
        Vacancy: KnockoutObservableAny;
        IsLoading: KnockoutObservableBool;

        CanDelete: KnockoutComputedFunctions;

        OnDelete: Function;

        constructor(deleteUri : string, element : any)
        {
            super();
            this.DeleteUri = deleteUri;
            this.Element = element;
            this.IsLoading = ko.observable(false);
            this.Vacancy = ko.observable({});
            this.CanDelete = ko.computed(this.cb_ComputeCanDelete);
        }

        ComputeCanDelete() : boolean
        {
            return this.IsLoading() == false;
        }
        cb_ComputeCanDelete() { return this.ComputeCanDelete(); }

        Delete() {
            this.IsLoading(true);
            $.ajax({
                type: "POST",
                url: (<any>this.DeleteUri).format(this.Vacancy().VacancyId),
                dataType: "json",
                traditional: true,
                success: (result) => {
                    this.IsLoading(false);
                    this.Close();

                    if (this.OnDelete != null)
                        this.OnDelete();
                }
            });
        }
        cb_Delete() { this.Delete(); } 

        Close() {
            $(this.Element).modal('hide');
        }
        cb_Close() { this.Close(); }
    }
}

