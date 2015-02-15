/// <reference path="../Definitions/jquery/jquery.d.ts" />
/// <reference path="../Definitions/bootstrap/bootstrap.d.ts" />
/// <reference path="../Definitions/linq/linq.d.ts" />
/// <reference path="../Definitions/Knockout/knockout.d.ts" />
/// <reference path="../HasCallbacks.ts" />
/// <reference path="../Models.ts" />

module ViewModels {
    interface ISanctionVacancyResponse {
        Results: ISanctionVacancyResultItem[];
    }

    interface ISanctionVacancyResultItem {
        VacancyId: number;
        SapPositionNumber: string;
        SanctionedReferenceNumber: string;
    }

    export class SanctionVacancyViewModel extends HasCallbacks {

        SanctionUri: string;
        VacancyUri: string;
        Element: any;
        public SapPositionNumber: KnockoutObservableString;
        public SanctionedReferenceNumber: KnockoutObservableString;
        public IsNotSap: KnockoutObservableBool;
        Vacancies: KnockoutObservableArray;
        IsLoading: KnockoutObservableBool;
        OnSanction: Function;

        CanSanction: KnockoutComputedFunctions;
        IsSap: KnockoutComputedFunctions;

        constructor(sanctionUri: string, vacancyUri: string, element: any) {
            super();

            this.SanctionUri = sanctionUri;
            this.VacancyUri = vacancyUri;
            this.Element = element;
            this.SapPositionNumber = ko.observable('');
            this.SanctionedReferenceNumber = ko.observable('');
            this.IsNotSap = ko.observable(false);
            this.IsLoading = ko.observable(false);
            this.Vacancies = ko.observableArray(new Array());
            this.CanSanction = ko.computed(this.cb_ComputeCanSanction);
        }

        Clear() {
            this.IsLoading(false);

            this.SapPositionNumber('');
            this.SanctionedReferenceNumber('');
        }

        ComputeCanSanction(): boolean {
            if (this.Vacancies().length >= 1) {
                if (this.IsNotSap() == true) {
                    return true;
                }

                if (this.SapPositionNumber().length == 8 /* SAP Position Number is 8 characters long. */
                &&
                this.SanctionedReferenceNumber().length <= 12) /* Sanctioned Reference Number is 12 characters or less long. */
                    return true;
                else {
                    return false;
                }
            }
        }

        cb_ComputeCanSanction() {
            return this.ComputeCanSanction();
        }

        Sanction() {
            var vacancies = Enumerable.From(this.Vacancies());

            var data = {
                vacancyId: vacancies.Select(x => x.VacancyId).ToArray(),
                sapPositionNumber: this.SapPositionNumber(),
                sanctionedReferenceNumber: this.SanctionedReferenceNumber(),
                isNotSap: this.IsNotSap()
            }

            this.IsLoading(true);

            $.ajax({
                type: "POST",
                url: this.SanctionUri,
                data: data,
                dataType: "json",
                traditional: true,
                success: (result) => {
                    this.IsLoading(false);
                    this.Close();

                    if (this.OnSanction != null)
                        this.OnSanction();

                    alert('Vacancy has been sanctioned');
                }
            });
        }

        cb_Sanction() { this.Sanction(); }

        Close() {
            $(this.Element).modal('hide');
        }
        cb_Close() { this.Close(); }
    }
}