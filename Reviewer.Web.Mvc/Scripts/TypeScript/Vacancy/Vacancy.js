var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ViewModels;
(function (ViewModels) {
    var VacancyViewModel = (function (_super) {
        __extends(VacancyViewModel, _super);
        function VacancyViewModel(addCommentUrl) {
            var _this = this;
                _super.call(this);
            this.Countries = ko.observableArray();
            this.Sites = ko.observableArray();
            this.DomicileCountrySiteList = ko.observableArray();
            this.WorkLocationCountrySiteList = ko.observableArray();
            this.DomicileCountry = ko.observable('');
            this.DomicileCountry.subscribe(function (newValue) {
                _this.ChangeSiteList(newValue, _this.DomicileCountrySiteList);
            });
            this.WorkLocationCountry = ko.observable('');
            this.WorkLocationCountry.subscribe(function (newValue) {
                _this.ChangeSiteList(newValue, _this.WorkLocationCountrySiteList);
            });
            this.DomicileSite = ko.observable('');
            this.WorkLocationSite = ko.observable('');
            this.SAPPositionNumber = ko.observable('');
            this.StaffID = ko.observable('');
            this.VacancyId = ko.observable('');
            this.Url = addCommentUrl;
            this.HasResource = ko.computed(function () {
                return _this.StaffID() != '';
            });
            this.HasVacancyId = ko.computed(function () {
                return _this.VacancyId() != '';
            });
            this.NewComment = ko.observable('');
            this.CanAddComment = ko.computed(this.cb_ComputeCanAddComment);
        }
        VacancyViewModel.prototype.ChangeSiteList = function (countryName, siteArray) {
            var country = Enumerable.From(this.Countries()).FirstOrDefault(null, function (x) {
                return x.LookupValue == countryName;
            });
            if(country) {
                var siteList = Enumerable.From(this.Sites()).Where(function (x) {
                    return x.DependentLookupId == country.LookupId;
                }).ToArray();
                siteArray(siteList);
            }
        };
        VacancyViewModel.prototype.Populate = function (json) {
            var obj = $.parseJSON(json);
            this.Countries(obj.Countries);
            this.Sites(obj.Sites);
        };
        VacancyViewModel.prototype.AddComment = function (roleId) {
            if(this.NewComment().length > 0) {
                $.ajax({
                    type: 'POST',
                    url: this.Url,
                    data: {
                        id: roleId,
                        comment: this.NewComment()
                    },
                    dataType: 'JSON',
                    success: function (data) {
                        VacancyViewModel.prototype.ClearComment();
                        $('.jsonComment').empty();
                        $.each(data.Comments, function (index, value) {
                            $('.jsonComment').append($('<tr><td>' + value.User + '</td><td>' + moment(value.Date).format('DD/MM/YYYY HH:mm:ss') + '</td><td>' + value.Comment + '</td></tr>'));
                        });
                    }
                });
            }
        };
        VacancyViewModel.prototype.ClearComment = function () {
            this.NewComment = ko.observable('');
            $('.commentInput').val("");
        };
        VacancyViewModel.prototype.cb_ComputeCanAddComment = function () {
            return this.ComputeCanAddComment();
        };
        VacancyViewModel.prototype.ComputeCanAddComment = function () {
            if(this.NewComment() == "") {
                return false;
            } else {
                return true;
            }
        };
        return VacancyViewModel;
    })(HasCallbacks);
    ViewModels.VacancyViewModel = VacancyViewModel;    
})(ViewModels || (ViewModels = {}));
