/// <reference path="Definitions/Knockout/knockout.d.ts" />

interface IViewVacanciesRecord {
	VacancyId: number;
    CostCentre: string;
    Grade: string;
    LineManagerFirstName: string;
    LineManagerLastName: string;
    Name: string;
    Site: string;
    Status: string;
    IsSap: boolean;

    IsSelected: KnockoutObservableBool;
}

interface IResourceDto { 


}

interface ISearchRequest {
    OrderBy: string;
    Page: number;
    PageSize: number;
}

interface ISearchResponse {
    Results: any[];
    Page: number;
    PageSize: number;
    TotalPages: number;
    TotalResults: number;
}

interface IResourceSearchRequestModel extends ISearchRequest {
    StaffID: string;
    CostCentre: string;
    OrganizationalUnit: string;
    Name: string;
    FirstName: string;
    LastName: string;
    OnlyOrphan: boolean;
}

interface ITransferSearchRequestModel extends ISearchRequest {
    Incoming: boolean;
    Outgoing: boolean;
    OnlyRejected: boolean;
}

interface IFillVacancyResponse {
    Success: boolean;
    Message: string;
}